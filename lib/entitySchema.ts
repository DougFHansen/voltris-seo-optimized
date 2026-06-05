export interface Entity {
  name: string;
  type: 'Software' | 'Game' | 'Hardware' | 'OperatingSystem' | 'Technology' | 'Organization';
  description?: string;
  url?: string;
}

import { extractCategoryEntities, getCategoryEntityMap } from './entityMapping';

/**
 * Gera JSON-LD Schema para entidades (Entity SEO)
 * Fortalece autoridade semântica para jogos, tecnologias, hardware, etc.
 * 
 * Atualizado para AEO/GEO: inclui entidades específicas por categoria
 */
export function generateEntitySchema(entities: Entity[], category?: string) {
  // Adiciona entidades específicas da categoria se fornecida
  let allEntities = [...entities];
  
  if (category) {
    const categoryMap = getCategoryEntityMap(category);
    const categoryEntities = categoryMap.entities.map(name => ({
      name,
      type: 'Technology' as const,
      description: `Technical entity related to ${category}`
    }));
    allEntities = [...allEntities, ...categoryEntities];
  }
  
  const schemaEntities = allEntities.map(entity => {
    const baseEntity: any = {
      "@type": entity.type,
      "name": entity.name
    };
    
    if (entity.description) {
      baseEntity.description = entity.description;
    }
    
    if (entity.url) {
      baseEntity.url = entity.url;
    }
    
    return baseEntity;
  });
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": schemaEntities.map((entity, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": entity
    }))
  };
}

/**
 * Extrai entidades de texto para Entity SEO
 * Atualizado para AEO/GEO: inclui category-aware entity extraction
 */
export function extractEntitiesFromText(text: string, category?: string): Entity[] {
  const entities: Entity[] = [];
  const lowerText = text.toLowerCase();
  
  // Jogos
  const games = [
    { name: 'Valorant', type: 'Game' as const, url: 'https://playvalorant.com' },
    { name: 'Counter-Strike 2', type: 'Game' as const, url: 'https://counter-strike.net' },
    { name: 'Grand Theft Auto V', type: 'Game' as const, url: 'https://www.rockstargames.com/gta-v' },
    { name: 'Minecraft', type: 'Game' as const, url: 'https://www.minecraft.net' },
    { name: 'Fortnite', type: 'Game' as const, url: 'https://www.fortnite.com' },
    { name: 'League of Legends', type: 'Game' as const, url: 'https://www.leagueoflegends.com' },
    { name: 'Call of Duty: Warzone', type: 'Game' as const, url: 'https://www.callofduty.com/warzone' },
    { name: 'Elden Ring', type: 'Game' as const, url: 'https://www.eldenring.com' },
    { name: 'Cyberpunk 2077', type: 'Game' as const, url: 'https://www.cyberpunk.net' },
    { name: 'Street Fighter 6', type: 'Game' as const, url: 'https://www.streetfighter.com' },
    { name: 'Age of Empires 6', type: 'Game' as const, url: 'https://www.ageofempires.com' },
    { name: 'Starfield 2', type: 'Game' as const, url: 'https://bethesda.net' },
    { name: 'STALKER 2', type: 'Game' as const, url: 'https://www.stalker-game.com' },
    { name: 'Resident Evil 9', type: 'Game' as const, url: 'https://www.residentevil.com' },
    { name: 'GTA 6', type: 'Game' as const, url: 'https://www.rockstargames.com/gta-vi' },
    { name: 'Forza Motorsport 2026', type: 'Game' as const, url: 'https://www.forzamotorsport.net' },
    { name: 'Elder Scrolls 6', type: 'Game' as const, url: 'https://www.elderscrolls.com' },
    { name: 'EA Sports FC 2026', type: 'Game' as const, url: 'https://www.ea.com/fc' }
  ];
  
  games.forEach(game => {
    if (lowerText.includes(game.name.toLowerCase())) {
      entities.push(game);
    }
  });
  
  // Tecnologias
  const technologies = [
    { name: 'DirectX', type: 'Technology' as const, url: 'https://learn.microsoft.com/windows/win32/directx' },
    { name: 'Vulkan', type: 'Technology' as const, url: 'https://www.vulkan.org' },
    { name: 'OpenGL', type: 'Technology' as const, url: 'https://www.opengl.org' },
    { name: 'DLSS', type: 'Technology' as const, url: 'https://www.nvidia.com/ai-for-games/dlss' },
    { name: 'FSR', type: 'Technology' as const, url: 'https://www.amd.com/en/technologies/fsr' },
    { name: 'Steam', type: 'Software' as const, url: 'https://store.steampowered.com' },
    { name: 'Epic Games', type: 'Organization' as const, url: 'https://www.epicgames.com' },
    { name: 'Ray Tracing', type: 'Technology' as const, url: 'https://www.nvidia.com/en-us/geforce/technologies/ray-tracing/' },
    { name: 'G-Sync', type: 'Technology' as const, url: 'https://www.nvidia.com/en-us/geforce/technologies/g-sync/' },
    { name: 'FreeSync', type: 'Technology' as const, url: 'https://www.amd.com/en/technologies/freesync-premium-pro' }
  ];
  
  technologies.forEach(tech => {
    if (lowerText.includes(tech.name.toLowerCase())) {
      entities.push(tech);
    }
  });
  
  // Hardware
  const hardware = [
    { name: 'NVIDIA GeForce', type: 'Hardware' as const, url: 'https://www.nvidia.com/geforce' },
    { name: 'AMD Radeon', type: 'Hardware' as const, url: 'https://www.amd.com/products/graphics' },
    { name: 'Intel Core', type: 'Hardware' as const, url: 'https://www.intel.com/content/www/us/en/products/processors/core.html' },
    { name: 'AMD Ryzen', type: 'Hardware' as const, url: 'https://www.amd.com/products/processors' },
    { name: 'RTX 4060', type: 'Hardware' as const, url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/' },
    { name: 'RTX 4070', type: 'Hardware' as const, url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/' },
    { name: 'RTX 4080', type: 'Hardware' as const, url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/' },
    { name: 'SSD NVMe', type: 'Hardware' as const, url: 'https://www.kingston.com/en/uss' },
    { name: 'DDR5', type: 'Hardware' as const, url: 'https://www.kingston.com/en/uss' }
  ];
  
  hardware.forEach(hw => {
    if (lowerText.includes(hw.name.toLowerCase())) {
      entities.push(hw);
    }
  });
  
  // Windows
  const windows = [
    { name: 'Windows 11', type: 'OperatingSystem' as const, url: 'https://www.microsoft.com/windows' },
    { name: 'Windows 10', type: 'OperatingSystem' as const, url: 'https://www.microsoft.com/windows' },
    { name: 'Windows Update', type: 'Software' as const, url: 'https://support.microsoft.com/windows/update-windows-10-2c89e3ce-259b-4662-8c06-3d1e1c5d0e1b' }
  ];
  
  windows.forEach(os => {
    if (lowerText.includes(os.name.toLowerCase())) {
      entities.push(os);
    }
  });
  
  // Adiciona entidades específicas da categoria (AEO/GEO)
  if (category) {
    const categoryEntities = extractCategoryEntities(text, category);
    categoryEntities.forEach(catEntity => {
      if (!entities.some(e => e.name.toLowerCase() === catEntity.toLowerCase())) {
        entities.push({
          name: catEntity,
          type: 'Technology' as const,
          description: `Technical entity for ${category}`
        });
      }
    });
  }
  
  return entities;
}
