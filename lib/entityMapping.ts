/**
 * Entity Mapping por Categoria para AEO/GEO
 * 
 * Este arquivo define entidades específicas por categoria para reforçar
 * o Entity SEO e tornar o conteúdo mais citável por IAs.
 * 
 * Cada categoria tem suas próprias entidades técnicas que são
 * reconhecidas pelo Knowledge Graph e relevantes para o contexto.
 */

export interface CategoryEntityMap {
    category: string;
    entities: string[];
    technicalTerms: string[];
    relatedConcepts: string[];
}

export const CATEGORY_ENTITY_MAPS: Record<string, CategoryEntityMap> = {
    'games-fix': {
        category: 'games-fix',
        entities: [
            'GPU', 'CPU', 'RAM', 'SSD', 'NVMe', 'DirectX', 'OpenGL', 'Vulkan',
            'Ray Tracing', 'DLSS', 'FSR', 'Frame Rate', 'Input Lag', 'Response Time',
            'Refresh Rate', 'V-Sync', 'G-Sync', 'FreeSync', 'Resolution', 'FPS'
        ],
        technicalTerms: [
            'Anti-Aliasing', 'Texture Quality', 'Shadow Quality', 'Lighting',
            'Particle Effects', 'Motion Blur', 'Bloom', 'Ambient Occlusion',
            'Anisotropic Filtering', 'Vertical Sync', 'Triple Buffering'
        ],
        relatedConcepts: [
            'Gaming Performance', 'Competitive Gaming', 'Tournament Settings',
            'Esports Optimization', 'Hardware Acceleration', 'GPU Drivers'
        ]
    },
    'windows-erros': {
        category: 'windows-erros',
        entities: [
            'Windows Update', 'wuauserv', 'bits', 'cryptSvc', 'SoftwareDistribution',
            'DISM', 'SFC', 'chkdsk', 'Registry', 'System32', 'Event Viewer',
            'Blue Screen', 'BSOD', 'Error Code', 'Stop Code'
        ],
        technicalTerms: [
            'Command Prompt', 'PowerShell', 'Administrator', 'Service',
            'Process', 'DLL', 'Corrupt Files', 'System Restore', 'Safe Mode'
        ],
        relatedConcepts: [
            'Windows Troubleshooting', 'System Repair', 'Boot Configuration',
            'Driver Issues', 'Software Conflicts', 'Malware Removal'
        ]
    },
    'windows-otimizacao': {
        category: 'windows-otimizacao',
        entities: [
            'Windows 11', 'Windows 10', 'Power Plan', 'Game Mode', 'VBS',
            'Core Parking', 'CPU Scheduling', 'Memory Management', 'Virtual Memory',
            'Page File', 'Registry Tweaks', 'Services', 'Startup Programs'
        ],
        technicalTerms: [
            'Ultimate Performance', 'High Performance', 'Balanced', 'Power Saver',
            'Hiberboot', 'Fast Startup', 'Indexing', 'Superfetch', 'SysMain'
        ],
        relatedConcepts: [
            'System Performance', 'Boot Time', 'Application Launch',
            'Resource Management', 'Background Processes', 'System Latency'
        ]
    },
    'hardware': {
        category: 'hardware',
        entities: [
            'NVIDIA', 'AMD', 'Intel', 'RTX', 'GTX', 'Radeon', 'Ryzen', 'Core i',
            'PCIe', 'DDR4', 'DDR5', 'NVMe Gen3', 'NVMe Gen4', 'SATA', 'M.2',
            'BIOS', 'UEFI', 'CMOS', 'Overclock', 'Undervolt', 'Thermal Paste'
        ],
        technicalTerms: [
            'Clock Speed', 'Boost Clock', 'Base Clock', 'Memory Frequency',
            'CAS Latency', 'Timings', 'Voltage', 'TDP', 'Temperature', 'Fan Curve'
        ],
        relatedConcepts: [
            'PC Building', 'Hardware Compatibility', 'System Upgrades',
            'Performance Tuning', 'Thermal Management', 'Component Selection'
        ]
    },
    'network': {
        category: 'network',
        entities: [
            'Ethernet', 'Wi-Fi', 'DNS', 'DHCP', 'Router', 'Modem', 'Switch',
            'QoS', 'Port Forwarding', 'NAT', 'UPnP', 'IP Address', 'Subnet Mask',
            'Gateway', 'Ping', 'Latency', 'Packet Loss', 'Jitter'
        ],
        technicalTerms: [
            'Bandwidth', 'Throughput', 'MTU', 'TCP Window', 'UDP',
            'Firewall', 'VPN', 'Proxy', 'DNS Server', 'Static IP', 'Dynamic IP'
        ],
        relatedConcepts: [
            'Network Optimization', 'Gaming Network', 'Streaming Quality',
            'Remote Access', 'Network Security', 'Connection Stability'
        ]
    },
    'default': {
        category: 'default',
        entities: [
            'Windows', 'PC', 'Computer', 'Software', 'Hardware', 'Driver',
            'Update', 'Configuration', 'Settings', 'Performance', 'Optimization'
        ],
        technicalTerms: [
            'System', 'Process', 'Application', 'Service', 'Registry',
            'Command', 'Script', 'Automation', 'Troubleshooting', 'Repair'
        ],
        relatedConcepts: [
            'Technical Support', 'System Administration', 'IT Solutions',
            'Computer Science', 'Software Engineering', 'Digital Technology'
        ]
    }
};

/**
 * Obtém o mapa de entidades para uma categoria específica
 */
export function getCategoryEntityMap(category: string): CategoryEntityMap {
    return CATEGORY_ENTITY_MAPS[category] || CATEGORY_ENTITY_MAPS['default'];
}

/**
 * Extrai entidades relevantes do texto baseado na categoria
 */
export function extractCategoryEntities(text: string, category: string): string[] {
    const entityMap = getCategoryEntityMap(category);
    const allRelevantEntities = [
        ...entityMap.entities,
        ...entityMap.technicalTerms,
        ...entityMap.relatedConcepts
    ];
    
    // Normaliza o texto para comparação case-insensitive
    const normalizedText = text.toLowerCase();
    
    // Encontra entidades presentes no texto
    const foundEntities = allRelevantEntities.filter(entity =>
        normalizedText.includes(entity.toLowerCase())
    );
    
    return [...new Set(foundEntities)]; // Remove duplicatas
}
