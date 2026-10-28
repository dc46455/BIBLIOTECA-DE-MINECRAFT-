/**
 * Catálogo exclusivo de la Colección Oficial de Libros de Minecraft (Mojang / HarperCollins)
 */
const INITIAL_BOOKS = [
  {
    id: "mc-manual-supervivencia",
    title: "Minecraft: Manual de Supervivencia",
    author: "Mojang Studios & Stephanie Milton",
    category: "Supervivencia",
    year: 2024,
    pages: 112,
    price: 14.99,
    cover: "images/manual-supervivencia.webp",
    coverColor: "#2e7d32",
    rating: 5,
    isFavorite: true,
    isRead: false,
    currentPage: 1,
    synopsis: "El libro oficial imprescindible para dominar el Overworld. Aprende a encontrar recursos vitales, fabricar tu equipo esencial, protegerte de las criaturas nocturnas y sobrevivir con éxito a tus primeros días.",
    content: [
      {
        title: "Capítulo 1: El Despertar y el Primer Refugio",
        text: "Apareces en medio de un bioma desconocido. El sol se encuentra en el cenit y dispones de aproximadamente diez minutos antes de que caiga la noche. Tu primera prioridad es golpear árboles con los puños para obtener bloques de madera cruda.\n\nCon cuatro tablones de madera crea tu primera Mesa de Crafteo (Crafting Table). Elabora un pico de madera y pica al menos tres bloques de adoquín (Cobblestone) para actualizar tus herramientas de inmediato. La piedra te otorgará la velocidad y durabilidad necesarias para recolectar carbón, encender antorchas y sellar tu primera cueva o refugio antes de que aparezcan los Creepers, Arañas y Esqueletos."
      },
      {
        title: "Capítulo 2: Minería Estratégica y Diamantes",
        text: "Regla de oro de todo minero de Minecraft: ¡NUNCA piques directamente bajo tus pies ni hacia arriba! Un lago de lava subterráneo o una caída letal pueden destruir tu inventario en un instante.\n\nPara conseguir diamantes en las versiones modernas, desciende hasta la capa Y: -58. La técnica de túneles paralelos de 2x1 bloques con 3 bloques de separación es la más eficiente. Lleva siempre contigo un cubo de agua: salvará tu vida si caes en lava y convertirá el magma en obsidiana para tu portal al Nether."
      },
      {
        title: "Capítulo 3: Alimentación, Ganadería y Cultivos",
        text: "La barra de hambre es tu salvavidas: si está llena al máximo, regenerarás corazones rápidamente; si cae a cero, comenzarás a recibir daño continuo.\n\nConstruye corrales con vallas y atrae vacas usando trigo. Las vacas te proporcionarán filetes cocinados (uno de los alimentos con mayor nivel de saturación) y cuero, indispensable para fabricar librerías que potenciarán tu mesa de encantamientos al nivel máximo (nivel 30)."
      }
    ]
  },
  {
    id: "mc-manual-redstone",
    title: "Minecraft: Manual de Redstone",
    author: "Mojang Studios & Nick Farwell",
    category: "Ingeniería & Redstone",
    year: 2024,
    pages: 96,
    price: 14.99,
    cover: "images/manual-redstone.jpg",
    coverColor: "#c62828",
    rating: 5,
    isFavorite: true,
    isRead: false,
    currentPage: 1,
    synopsis: "La guía definitiva para convertirte en un maestro ingeniero. Descubre cómo aprovechar los circuitos de redstone, repetidores, pistones, tolvas y comparadores para crear asombrosas granjas automáticas y mecanismos secretos.",
    content: [
      {
        title: "Capítulo 1: Fundamentos de la Energía y Cableado",
        text: "El polvo de redstone funciona como el cableado eléctrico de Minecraft. Una señal activada puede viajar hasta 15 bloques de distancia desde su fuente emisora (antorchas de redstone, bloques de redstone, palancas o botones).\n\nPara extender la corriente más allá de 15 bloques, debes colocar un repetidor de redstone (Redstone Repeater). Además, el repetidor te permite configurar un retraso o retardo de 1 a 4 'ticks' (0.1 a 0.4 segundos), vital para sincronizar puertas secretas y trampas mecánicas."
      },
      {
        title: "Capítulo 2: Comparadores y Detección de Contenedores",
        text: "El comparador de redstone es el elemento más sofisticado de la ingeniería de bloques. Mide el nivel de llenado de inventarios como cofres, barriles y tolvas, emitiendo una señal proporcional a la cantidad de ítems que contienen.\n\nEn modo sustracción (antorcha frontal encendida), el comparador resta la intensidad de la señal lateral a la señal posterior. Esto permite diseñar relojes ultra rápidos y sistemas de clasificación automática de cofres."
      },
      {
        title: "Capítulo 3: Automatización de Granjas y Tolvas",
        text: "A través del uso de observadores (Observer blocks) que detectan cambios de estado en bloques vecinos y pistones pegajosos, puedes automatizar al 100% la cosecha de caña de azúcar, calabazas, bambú y sandías.\n\nLas tolvas colocadas debajo canalizan los cultivos caídos directamente a tus cofres principales, produciendo recursos infinitos mientras tú exploras el mundo."
      }
    ]
  },
  {
    id: "mc-guia-combate",
    title: "Minecraft: Guía de Combate",
    author: "Mojang Studios & Stephanie Milton",
    category: "Combate",
    year: 2024,
    pages: 112,
    price: 15.99,
    cover: "images/guia-combate.webp",
    coverColor: "#7b1fa2",
    rating: 5,
    isFavorite: true,
    isRead: false,
    currentPage: 1,
    synopsis: "Prepárate para la batalla: técnicas avanzadas para enfrentarte a todas las criaturas hostiles, dominar el escudo, arcos y espadas con encantamientos letales, y derrotar a los jefes supremos (Wither y Ender Dragón).",
    content: [
      {
        title: "Capítulo 1: Equipamiento de Guerra y Escudos",
        text: "Una buena espada es inútil sin una armadura resistente. La armadura de hierro es tu primer estándar de protección, pero tu meta debe ser conseguir una armadura completa de diamante y mejorarla posteriormente con lingotes de inframundo (Netherite) en la mesa de herrería.\n\nEl escudo (fabricado con 6 tablones y 1 lingote de hierro) es el objeto defensivo más poderoso: bloquea el 100% del daño frontal, incluyendo las flechas de los esqueletos y las devastadoras explosiones a quemarropa de los Creepers."
      },
      {
        title: "Capítulo 2: Tácticas contra Criaturas Hostiles",
        text: "Cada enemigo en Minecraft requiere una estrategia diferente:\n\n• Enderman: Nunca lo mires fijamente a los ojos. Si te ataca, colócate debajo de un techo de 2 bloques de altura donde él no pueda entrar debido a su estatura de 3 bloques, o rodéate de agua.\n• Creeper: Golpea con salto (golpe crítico) y retrocede inmediatamente hacia atrás para evitar el radio de detonación.\n• Esqueleto: Cúbrete con el escudo hasta que dispare su flecha, avanza en el intervalo de recarga y ataca cuerpo a cuerpo."
      },
      {
        title: "Capítulo 3: La Batalla Final: El Ender Dragón",
        text: "Para llegar al End necesitas activar un Portal del End con 12 Ojos de Ender. Antes de saltar, equípate con flechas, un arco potente, cubos de agua, perlas de ender y bloques de construcción.\n\nAl llegar a la isla central, tu primera tarea antes de golpear al dragón es destruir los Cristales del End situados sobre las torres de obsidiana, ya que regeneran continuamente la salud de la bestia. Una vez destruidos, ataca al dragón cuando baje a posarse en la fuente central."
      }
    ]
  },
  {
    id: "mc-manual-explorador",
    title: "Minecraft: Manual del Explorador",
    author: "Mojang Studios & Stephanie Milton",
    category: "Exploración",
    year: 2024,
    pages: 96,
    price: 14.99,
    cover: "images/manual-explorador.webp",
    coverColor: "#0d47a1",
    rating: 5,
    isFavorite: false,
    isRead: false,
    currentPage: 1,
    synopsis: "Explora los biomas más misteriosos, aprende a cartografiar tus rutas, adéntrate en monumentos oceánicos, mansiones del bosque y conquista los confines del Nether y el End.",
    content: [
      {
        title: "Capítulo 1: Navegación, Mapas y Coordenadas",
        text: "Perderse en el inmenso mundo de Minecraft es fácil si no tomas precauciones. Activa la pantalla de depuración (F3 en PC) para monitorear tus coordenadas X, Y, Z. Anota siempre las coordenadas de tu base principal y de los portales.\n\nCrea una Brújula (4 lingotes de hierro y 1 redstone) que siempre apuntará hacia el punto de aparición original del mundo. Al combinar la brújula con papel en una mesa de cartografía, obtendrás mapas ampliables para trazar imperios enteros."
      },
      {
        title: "Capítulo 2: Estructuras Legendarias y Botines",
        text: "El mundo está repleto de secretos antiguos:\n\n• Mansiones del Bosque: Ocultas en densos bosques oscuros, habitadas por temibles Invocadores (Evokers) que sueltan el preciado Tótem de la Inmortalidad.\n• Monumentos Oceánicos: Estructuras submarinas protegidas por Guardianes y el Guardián Anciano; albergan esponjas y bloques de prismarina.\n• Ciudades del End (End Cities): El premio supremo tras derrotar al dragón. Explora los barcos flotantes para obtener los Élitros (Elytra), alas que te permitirán volar por los cielos."
      },
      {
        title: "Capítulo 3: Supervivencia en el Nether",
        text: "El Nether es una dimensión infernal donde no hay agua y las camas explotan al intentar dormir. Protégete usando al menos una pieza de armadura de oro para evitar que los Piglins te ataquen de inmediato.\n\nLocaliza Fortalezas del Nether para encontrar Blazes y Verrugas del Nether, y Bastiones para saquear cofres repletos de oro, armaduras encantadas y las codiciadas plantillas de herrería de inframundo."
      }
    ]
  }
];
