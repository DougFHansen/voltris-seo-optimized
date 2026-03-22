"""
Diagnóstico de CPU - Identifica causa raiz de uso excessivo
Requer: pip install psutil
"""

import psutil
import time
import os
import sys
from datetime import datetime
from collections import defaultdict

INTERVALO = 2       # segundos entre cada leitura
DURACAO = 60        # segundos de monitoramento total
LIMITE_CPU = 5.0    # % mínimo pra considerar processo relevante

def formatar_bytes(b):
    for u in ['B', 'KB', 'MB', 'GB']:
        if b < 1024:
            return f"{b:.1f} {u}"
        b /= 1024
    return f"{b:.1f} TB"

def coletar_processos():
    processos = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info', 'status', 'username', 'num_threads']):
        try:
            info = proc.info
            if info['cpu_percent'] is not None:
                processos.append(info)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return processos

def diagnostico_sistema():
    print("\n" + "="*60)
    print("  DIAGNÓSTICO DE SISTEMA - CPU & PERFORMANCE")
    print(f"  {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    print("="*60)

    # Info geral da CPU
    freq = psutil.cpu_freq()
    cpu_count = psutil.cpu_count(logical=False)
    cpu_logical = psutil.cpu_count(logical=True)
    
    print(f"\n[CPU]")
    print(f"  Núcleos físicos : {cpu_count} | Lógicos: {cpu_logical}")
    if freq:
        print(f"  Frequência atual: {freq.current:.0f} MHz | Max: {freq.max:.0f} MHz")
        if freq.current < freq.max * 0.5:
            print("  ⚠️  THROTTLING DETECTADO — CPU rodando abaixo de 50% da frequência máxima!")

    # Uso por núcleo
    per_core = psutil.cpu_percent(percpu=True, interval=1)
    print(f"\n[Uso por núcleo]")
    for i, uso in enumerate(per_core):
        barra = "█" * int(uso / 5) + "░" * (20 - int(uso / 5))
        alerta = " ⚠️" if uso > 80 else ""
        print(f"  Core {i}: [{barra}] {uso:5.1f}%{alerta}")

    # RAM
    ram = psutil.virtual_memory()
    swap = psutil.swap_memory()
    print(f"\n[Memória]")
    print(f"  RAM Total : {formatar_bytes(ram.total)}")
    print(f"  RAM Usada : {formatar_bytes(ram.used)} ({ram.percent:.1f}%)")
    print(f"  RAM Livre : {formatar_bytes(ram.available)}")
    if swap.used > 0:
        print(f"  ⚠️  SWAP/PAGEFILE em uso: {formatar_bytes(swap.used)} — sistema com pressão de memória!")

    # Disco
    print(f"\n[Disco I/O]")
    disco_antes = psutil.disk_io_counters()
    time.sleep(1)
    disco_depois = psutil.disk_io_counters()
    read_speed = (disco_depois.read_bytes - disco_antes.read_bytes) / 1024 / 1024
    write_speed = (disco_depois.write_bytes - disco_antes.write_bytes) / 1024 / 1024
    print(f"  Leitura : {read_speed:.2f} MB/s")
    print(f"  Escrita : {write_speed:.2f} MB/s")

def monitorar_top_processos(duracao=DURACAO, intervalo=INTERVALO):
    print(f"\n{'='*60}")
    print(f"  MONITORANDO PROCESSOS POR {duracao}s (intervalo: {intervalo}s)")
    print(f"  Abra os apps que causam engasgo agora...")
    print(f"{'='*60}\n")

    acumulado = defaultdict(lambda: {'cpu': [], 'mem': 0, 'nome': '', 'threads': 0})

    # Primeira leitura pra inicializar cpu_percent
    coletar_processos()
    time.sleep(intervalo)

    iteracoes = duracao // intervalo
    for i in range(iteracoes):
        processos = coletar_processos()
        timestamp = datetime.now().strftime('%H:%M:%S')
        
        top = sorted(processos, key=lambda x: x['cpu_percent'] or 0, reverse=True)[:5]
        print(f"[{timestamp}] Top processos:")
        for p in top:
            cpu = p['cpu_percent'] or 0
            mem = p['memory_info'].rss if p['memory_info'] else 0
            print(f"  {p['name']:<35} CPU: {cpu:5.1f}%  RAM: {formatar_bytes(mem)}")
            
            pid = p['pid']
            acumulado[pid]['cpu'].append(cpu)
            acumulado[pid]['mem'] = mem
            acumulado[pid]['nome'] = p['name']
            acumulado[pid]['threads'] = p['num_threads'] or 0

        print()
        if i < iteracoes - 1:
            time.sleep(intervalo)

    return acumulado

def relatorio_final(acumulado):
    print("="*60)
    print("  RELATÓRIO FINAL — MAIORES CONSUMIDORES DE CPU")
    print("="*60)

    # Filtra processos com média de CPU relevante
    relevantes = []
    for pid, dados in acumulado.items():
        if dados['cpu']:
            media = sum(dados['cpu']) / len(dados['cpu'])
            pico = max(dados['cpu'])
            if media >= LIMITE_CPU or pico >= 20:
                relevantes.append({
                    'nome': dados['nome'],
                    'media_cpu': media,
                    'pico_cpu': pico,
                    'mem': dados['mem'],
                    'threads': dados['threads'],
                    'pid': pid
                })

    relevantes.sort(key=lambda x: x['media_cpu'], reverse=True)

    if not relevantes:
        print("\n  Nenhum processo com uso significativo detectado.")
        print("  Tente rodar o script enquanto reproduz o engasgo.")
        return

    print(f"\n{'Nome':<35} {'Média CPU':>10} {'Pico CPU':>10} {'RAM':>10} {'Threads':>8}")
    print("-"*75)
    for p in relevantes[:15]:
        print(f"  {p['nome']:<33} {p['media_cpu']:>9.1f}% {p['pico_cpu']:>9.1f}% {formatar_bytes(p['mem']):>10} {p['threads']:>7}")

    print("\n[Diagnóstico automático]")
    
    suspeitos = [p for p in relevantes if p['media_cpu'] > 15]
    if suspeitos:
        print(f"\n  ⚠️  Processos com uso médio acima de 15%:")
        for s in suspeitos:
            nome = s['nome'].lower()
            print(f"\n  → {s['nome']} (média {s['media_cpu']:.1f}%)")
            
            # Diagnóstico por nome de processo
            if 'antimalware' in nome or 'msmpeng' in nome:
                print("     Causa provável: Windows Defender fazendo scan em background.")
                print("     Solução: Adicionar exclusões no Defender para pastas de trabalho.")
            elif 'searchindexer' in nome or 'searchprotocol' in nome:
                print("     Causa provável: Indexação do Windows em andamento.")
                print("     Solução: Desativar indexação ou aguardar conclusão.")
            elif 'tiworker' in nome or 'trustedinstaller' in nome:
                print("     Causa provável: Windows Update instalando/preparando updates.")
                print("     Solução: Aguardar conclusão ou pausar updates.")
            elif 'wuauclt' in nome or 'wuauserv' in nome:
                print("     Causa provável: Windows Update baixando atualizações.")
            elif 'svchost' in nome:
                print("     Causa provável: Serviço do Windows em background (svchost agrupa vários).")
                print("     Use o Resource Monitor (resmon.exe) pra ver qual serviço dentro do svchost.")
            elif 'chrome' in nome or 'msedge' in nome or 'firefox' in nome:
                print("     Causa provável: Navegador com muitas abas ou extensões pesadas.")
            elif 'steam' in nome:
                print("     Causa provável: Steam atualizando jogos ou fazendo scan de arquivos.")
            else:
                print("     Investigar manualmente no Resource Monitor (resmon.exe).")
    else:
        print("\n  CPU distribuída entre vários processos pequenos.")
        print("  Possível causa: muitos processos de startup acumulados.")
        print("  Recomendação: verificar 'msconfig' > Inicialização ou Task Manager > Startup.")

    # Verificar throttling
    freq = psutil.cpu_freq()
    if freq and freq.current < freq.max * 0.6:
        print(f"\n  ⚠️  THROTTLING TÉRMICO DETECTADO!")
        print(f"     CPU rodando a {freq.current:.0f} MHz (máx: {freq.max:.0f} MHz)")
        print(f"     Isso sozinho explica o engasgo — CPU sendo limitada por temperatura ou energia.")
        print(f"     Verifique: pasta térmica, ventilação, plano de energia (deve ser 'Alto Desempenho').")

    print("\n" + "="*60)
    print("  Salve este relatório e compartilhe para análise adicional.")
    print("="*60 + "\n")

if __name__ == "__main__":
    try:
        import psutil
    except ImportError:
        print("Instalando psutil...")
        os.system(f"{sys.executable} -m pip install psutil")
        import psutil

    diagnostico_sistema()
    acumulado = monitorar_top_processos()
    relatorio_final(acumulado)
