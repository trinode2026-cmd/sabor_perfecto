"""Catalogo base del restaurante: categorias, etiquetas, platillos y parametros del motor."""

# Categorias del menu con su icono de Material Symbols
CATEGORIAS = [
    ("Antojitos y Tacos", "Lo clasico de la calle, para un antojo rapido.", "lunch_dining", 1),
    ("Caldos y Sopas", "Platos calientes que reconfortan y llenan.", "ramen_dining", 2),
    ("Guisados Fuertes", "Recetas de cazuela con sabor de casa.", "dinner_dining", 3),
    ("Mariscos", "Frescura del mar con sazon mexicano.", "set_meal", 4),
    ("Enchiladas y Gratinados", "Tortilla, salsa y queso en su mejor version.", "bakery_dining", 5),
    ("Ligero y Fresco", "Opciones suaves para comer sin pesadez.", "eco", 6),
    ("Para Compartir", "Porciones grandes para dos o mas personas.", "groups", 7),
    ("Postres", "Para cerrar con algo dulce.", "cake", 8),
    ("Bebidas", "Aguas frescas, cafe y chocolate.", "local_cafe", 9),
]

# Etiquetas que sirven para filtrar el menu
ETIQUETAS = [
    ("Popular", "primary"),
    ("Picoso", "error"),
    ("Sin picante", "info"),
    ("Vegetariano", "success"),
    ("Economico", "secondary"),
    ("Tradicional", "warning"),
    ("Fresco", "info"),
    ("Bien servido", "primary"),
    ("Para compartir", "secondary"),
    ("Refrescante", "info"),
    ("Caliente", "warning"),
    ("Muy dulce", "error"),
]

# Platillos: nombre, descripcion, categoria, saciedad, picor, precio, minutos, etiquetas
PLATILLOS = [
    # Antojitos y Tacos
    (
        "Tacos al Pastor con Piña Asada",
        "Tres tacos en tortilla de maiz con carne al achiote del trompo, cebolla, cilantro y piña asada.",
        "Antojitos y Tacos", 50, 60, 85, 10, ["Popular", "Tradicional"],
    ),
    (
        "Tacos de Suadero",
        "Suadero suave cocido a fuego lento, servido en doble tortilla con salsa verde taquera.",
        "Antojitos y Tacos", 52, 55, 90, 12, ["Tradicional"],
    ),
    (
        "Tacos de Canasta Surtidos",
        "Cuatro tacos al vapor de papa, frijol y chicharron, con salsa roja y cebolla curtida.",
        "Antojitos y Tacos", 45, 35, 55, 8, ["Economico", "Tradicional"],
    ),
    (
        "Tacos de Birria Dorados",
        "Tacos dorados rellenos de birria de res deshebrada con queso fundido y consome aparte.",
        "Antojitos y Tacos", 58, 70, 110, 15, ["Popular", "Picoso"],
    ),
    (
        "Quesadilla de Flor de Calabaza",
        "Tortilla hecha a mano con queso Oaxaca derretido y flor de calabaza guisada con epazote.",
        "Antojitos y Tacos", 40, 10, 70, 10, ["Vegetariano", "Sin picante"],
    ),
    (
        "Sope de Chorizo",
        "Sope grueso con frijoles refritos, chorizo dorado, lechuga, crema y queso fresco.",
        "Antojitos y Tacos", 38, 45, 60, 10, ["Economico"],
    ),
    (
        "Huarache de Nopales",
        "Masa alargada con frijol, nopales asados, salsa verde, queso y cilantro fresco.",
        "Antojitos y Tacos", 48, 30, 75, 12, ["Vegetariano"],
    ),
    (
        "Tlacoyos de Frijol",
        "Dos tlacoyos de maiz azul rellenos de frijol, con nopalitos, queso y salsa martajada.",
        "Antojitos y Tacos", 42, 25, 65, 12, ["Vegetariano", "Economico"],
    ),
    (
        "Gringa de Pastor con Queso",
        "Tortilla de harina con carne al pastor y queso gratinado, con salsa de chile de arbol.",
        "Antojitos y Tacos", 55, 50, 95, 12, ["Popular"],
    ),
    (
        "Taco de Chicharron Prensado",
        "Chicharron prensado guisado en salsa roja bien picosa, con aguacate y cebolla.",
        "Antojitos y Tacos", 35, 65, 45, 8, ["Economico", "Picoso"],
    ),
    # Caldos y Sopas
    (
        "Pozole Rojo de Puerco",
        "Maiz cacahuazintle con maciza de cerdo en caldo de guajillo, con lechuga, rabano y oregano.",
        "Caldos y Sopas", 88, 65, 165, 25, ["Popular", "Tradicional", "Bien servido"],
    ),
    (
        "Menudo Estilo Norteño",
        "Pancita de res cocida toda la noche en caldo rojo de chile, con cebolla, limon y oregano.",
        "Caldos y Sopas", 85, 70, 155, 25, ["Tradicional", "Picoso"],
    ),
    (
        "Caldo de Res con Verduras",
        "Chambarete en caldo claro con elote, calabaza, zanahoria, chayote y arroz blanco.",
        "Caldos y Sopas", 90, 15, 175, 25, ["Sin picante", "Bien servido"],
    ),
    (
        "Sopa de Tortilla",
        "Caldillo de jitomate con tiras de tortilla frita, aguacate, queso panela y chile pasilla.",
        "Caldos y Sopas", 70, 35, 125, 15, ["Tradicional"],
    ),
    (
        "Birria de Res en Consome",
        "Res tatemada con adobo de chiles secos, servida en su consome con cebolla y cilantro.",
        "Caldos y Sopas", 92, 75, 195, 30, ["Popular", "Picoso", "Bien servido"],
    ),
    (
        "Pozole Verde de Pollo",
        "Maiz tierno y pollo en caldo de pepita, tomate verde y serrano, con chicharron encima.",
        "Caldos y Sopas", 85, 55, 160, 25, ["Tradicional", "Bien servido"],
    ),
    (
        "Caldo Tlalpeño",
        "Caldo de pollo con garbanzo, verduras, aguacate y chipotle que le da su toque ahumado.",
        "Caldos y Sopas", 75, 50, 140, 20, ["Tradicional"],
    ),
    # Guisados Fuertes
    (
        "Mole Poblano con Pollo",
        "Pierna de pollo bañada en mole de mas de veinte ingredientes, con arroz rojo y ajonjoli.",
        "Guisados Fuertes", 85, 40, 215, 20, ["Popular", "Tradicional", "Bien servido"],
    ),
    (
        "Cochinita Pibil",
        "Cerdo marinado en achiote y naranja agria, horneado en hoja de platano, con cebolla morada.",
        "Guisados Fuertes", 82, 55, 205, 20, ["Popular", "Tradicional"],
    ),
    (
        "Chiles en Nogada",
        "Chile poblano relleno de picadillo de frutas y carne, con nogada de nuez y granada.",
        "Guisados Fuertes", 80, 20, 285, 25, ["Tradicional", "Sin picante"],
    ),
    (
        "Barbacoa de Borrego",
        "Borrego cocido en maguey con su consome, tortillas recien hechas y salsa borracha.",
        "Guisados Fuertes", 90, 45, 255, 30, ["Popular", "Bien servido"],
    ),
    (
        "Carnitas Michoacanas Surtidas",
        "Maciza, cuerito y costilla doradas en cazo de cobre, con guacamole y tortillas de maiz.",
        "Guisados Fuertes", 88, 30, 230, 20, ["Popular", "Bien servido"],
    ),
    (
        "Mole Negro Oaxaqueño",
        "Mole negro de chilhuacle con pollo de rancho, platano macho y arroz al vapor.",
        "Guisados Fuertes", 84, 50, 245, 25, ["Tradicional"],
    ),
    (
        "Chile Relleno de Queso",
        "Poblano capeado relleno de queso Oaxaca en caldillo de jitomate, con frijoles de la olla.",
        "Guisados Fuertes", 76, 35, 170, 18, ["Vegetariano"],
    ),
    (
        "Tinga de Pollo con Arroz",
        "Pollo deshebrado en salsa de jitomate y chipotle, con arroz blanco y tostadas.",
        "Guisados Fuertes", 78, 45, 165, 18, ["Tradicional"],
    ),
    (
        "Pipian Verde con Cerdo",
        "Lomo de cerdo en salsa de pepita de calabaza y hierbas, con verdolagas y arroz.",
        "Guisados Fuertes", 80, 40, 195, 22, ["Tradicional"],
    ),
    (
        "Arrachera Asada con Guacamole",
        "Arrachera marinada al carbon con guacamole, frijoles charros, nopal asado y tortillas.",
        "Guisados Fuertes", 86, 25, 275, 22, ["Popular", "Bien servido"],
    ),
    # Mariscos
    (
        "Aguachile de Camaron",
        "Camaron curtido en limon con chile chiltepin, pepino y cebolla morada en rodajas.",
        "Mariscos", 50, 90, 215, 15, ["Picoso", "Fresco"],
    ),
    (
        "Ceviche de Pescado Estilo Nayarit",
        "Pescado blanco picado con limon, jitomate, zanahoria y serrano, servido con tostadas.",
        "Mariscos", 55, 45, 185, 15, ["Fresco"],
    ),
    (
        "Pescado Zarandeado",
        "Pescado entero abierto, untado de adobo y asado a las brasas, con arroz y ensalada.",
        "Mariscos", 85, 50, 365, 35, ["Bien servido", "Para compartir"],
    ),
    (
        "Camarones a la Diabla",
        "Camarones grandes en salsa de chile morita y guajillo bien picante, con arroz blanco.",
        "Mariscos", 78, 95, 255, 20, ["Picoso", "Popular"],
    ),
    (
        "Tostadas de Camaron",
        "Tres tostadas con camaron cocido, pico de gallo, aguacate y mayonesa de chipotle.",
        "Mariscos", 48, 40, 155, 12, ["Fresco"],
    ),
    (
        "Filete de Pescado al Mojo de Ajo",
        "Filete a la plancha bañado en mantequilla y ajo dorado, con verduras al vapor y arroz.",
        "Mariscos", 75, 15, 235, 20, ["Sin picante"],
    ),
    (
        "Pulpo Enchilado",
        "Pulpo suave asado en adobo de guajillo y morita, con pure de frijol y cebolla asada.",
        "Mariscos", 70, 80, 320, 25, ["Picoso"],
    ),
    # Enchiladas y Gratinados
    (
        "Enchiladas Suizas Gratinadas",
        "Tortillas rellenas de pollo en salsa verde cremosa, gratinadas con queso y crema.",
        "Enchiladas y Gratinados", 80, 45, 165, 18, ["Popular", "Tradicional"],
    ),
    (
        "Enchiladas Mineras",
        "Enchiladas en salsa de guajillo con papa y zanahoria, queso añejo y lechuga fresca.",
        "Enchiladas y Gratinados", 78, 55, 150, 18, ["Tradicional"],
    ),
    (
        "Enchiladas Entomatadas",
        "Tortillas en salsa de jitomate asado con pollo, cebolla, crema y queso fresco.",
        "Enchiladas y Gratinados", 72, 30, 135, 15, ["Tradicional"],
    ),
    (
        "Chilaquiles Verdes con Pollo",
        "Totopos recien fritos en salsa verde de tomate con pollo, crema, queso y aguacate.",
        "Enchiladas y Gratinados", 75, 50, 145, 15, ["Popular"],
    ),
    (
        "Chilaquiles Rojos con Huevo",
        "Totopos en salsa roja de chile de arbol con dos huevos estrellados y frijoles.",
        "Enchiladas y Gratinados", 70, 60, 130, 15, ["Picoso", "Economico"],
    ),
    (
        "Enfrijoladas con Queso Fresco",
        "Tortillas bañadas en frijol negro licuado con epazote, queso fresco y cebolla.",
        "Enchiladas y Gratinados", 65, 20, 115, 12, ["Vegetariano", "Economico"],
    ),
    # Ligero y Fresco
    (
        "Ensalada de Nopales",
        "Nopales asados con jitomate, cebolla, cilantro, queso fresco y oregano, con limon.",
        "Ligero y Fresco", 28, 15, 95, 10, ["Vegetariano", "Fresco", "Economico"],
    ),
    (
        "Pollo Asado con Verduras al Vapor",
        "Pechuga a la plancha con calabaza, zanahoria y brocoli al vapor, con arroz integral.",
        "Ligero y Fresco", 50, 10, 150, 18, ["Sin picante", "Fresco"],
    ),
    (
        "Tostadas de Atun Fresco",
        "Atun fresco en salsa de soya y limon sobre tostadas, con aguacate y ajonjoli.",
        "Ligero y Fresco", 42, 30, 140, 12, ["Fresco"],
    ),
    (
        "Crema de Elote",
        "Crema suave de elote dulce con granos enteros, un toque de epazote y queso rallado.",
        "Ligero y Fresco", 35, 5, 105, 15, ["Sin picante", "Vegetariano"],
    ),
    (
        "Ensalada de Jicama y Mango con Chile",
        "Bastones de jicama y mango con limon, chile en polvo y pepita tostada.",
        "Ligero y Fresco", 25, 35, 90, 8, ["Fresco", "Vegetariano", "Economico"],
    ),
    (
        "Calabacitas a la Mexicana",
        "Calabaza guisada con elote, jitomate, cebolla y chile verde, con queso derretido.",
        "Ligero y Fresco", 45, 25, 115, 15, ["Vegetariano"],
    ),
    # Para Compartir
    (
        "Molcajete Mixto para Dos",
        "Arrachera, pollo, chorizo y nopal en salsa de molcajete hirviendo, con queso asado.",
        "Para Compartir", 98, 70, 395, 30, ["Para compartir", "Picoso", "Bien servido"],
    ),
    (
        "Parrillada Norteña para Dos",
        "Cortes asados al carbon, chistorra, cebollitas y papas, con guacamole y tortillas.",
        "Para Compartir", 100, 35, 385, 35, ["Para compartir", "Bien servido", "Popular"],
    ),
    (
        "Churrasco con Chistorra",
        "Churrasco jugoso con chistorra dorada, frijoles charros y ensalada para dos personas.",
        "Para Compartir", 96, 30, 360, 30, ["Para compartir", "Bien servido"],
    ),
    (
        "Molcajete de Mariscos Picante",
        "Camaron, pulpo y pescado en salsa de chile morita muy picante, servido en molcajete.",
        "Para Compartir", 95, 85, 400, 30, ["Para compartir", "Picoso", "Bien servido"],
    ),
]

# Parametros de los conjuntos: variable, etiqueta, tipo, punto_a, punto_b, punto_c, punto_d
CONJUNTOS_DIFUSOS = [
    ("hambre", "bajo", "bajo", 25, 55, 0, 0),
    ("hambre", "medio", "medio", 25, 50, 75, 0),
    ("hambre", "alto", "alto", 50, 80, 0, 0),
    ("saciedad", "bajo", "bajo", 25, 55, 0, 0),
    ("saciedad", "medio", "medio", 25, 50, 75, 0),
    ("saciedad", "alto", "alto", 50, 80, 0, 0),
    ("picante", "bajo", "bajo", 20, 50, 0, 0),
    ("picante", "medio", "medio", 25, 50, 75, 0),
    ("picante", "alto", "alto", 50, 80, 0, 0),
    ("picor", "bajo", "bajo", 20, 50, 0, 0),
    ("picor", "medio", "medio", 25, 50, 75, 0),
    ("picor", "alto", "alto", 50, 80, 0, 0),
    ("presupuesto", "bajo", "bajo", 90, 150, 0, 0),
    ("presupuesto", "medio", "medio", 100, 170, 250, 0),
    ("presupuesto", "alto", "alto", 200, 300, 0, 0),
    ("precio", "bajo", "bajo", 90, 150, 0, 0),
    ("precio", "medio", "medio", 100, 170, 250, 0),
    ("precio", "alto", "alto", 200, 300, 0, 0),
    ("dulce", "bajo", "bajo", 20, 50, 0, 0),
    ("dulce", "medio", "medio", 25, 50, 75, 0),
    ("dulce", "alto", "alto", 50, 80, 0, 0),
    ("dulzor", "bajo", "bajo", 20, 50, 0, 0),
    ("dulzor", "medio", "medio", 25, 50, 75, 0),
    ("dulzor", "alto", "alto", 50, 80, 0, 0),
]

# Consecuente de cada regla segun el conjunto del usuario y el del platillo
MATRICES_REGLAS = {
    "saciedad": {
        "alto": {"alto": "muy_alta", "medio": "media", "bajo": "muy_baja"},
        "medio": {"alto": "media", "medio": "muy_alta", "bajo": "baja"},
        "bajo": {"alto": "muy_baja", "medio": "baja", "bajo": "muy_alta"},
    },
    "picor": {
        "alto": {"alto": "muy_alta", "medio": "alta", "bajo": "baja"},
        "medio": {"alto": "baja", "medio": "muy_alta", "bajo": "media"},
        "bajo": {"alto": "muy_baja", "medio": "baja", "bajo": "muy_alta"},
    },
    "dulzor": {
        "alto": {"alto": "muy_alta", "medio": "alta", "bajo": "baja"},
        "medio": {"alto": "baja", "medio": "muy_alta", "bajo": "media"},
        "bajo": {"alto": "muy_baja", "medio": "baja", "bajo": "muy_alta"},
    },
    "precio": {
        "alto": {"alto": "muy_alta", "medio": "alta", "bajo": "media"},
        "medio": {"alto": "baja", "medio": "muy_alta", "bajo": "alta"},
        "bajo": {"alto": "muy_baja", "medio": "baja", "bajo": "muy_alta"},
    },
}

# Perfiles que el usuario puede aplicar con un solo toque
PREAJUSTES = [
    {
        "clave": "hambriento",
        "nombre": "Con mucha hambre",
        "descripcion": "Algo bien servido y con sabor fuerte.",
        "icono": "local_fire_department",
        "hambre": 85,
        "picante": 75,
        "presupuesto": 180,
    },
    {
        "clave": "ligero",
        "nombre": "Algo ligero",
        "descripcion": "Comida suave y fresca, sin pesadez.",
        "icono": "eco",
        "hambre": 30,
        "picante": 15,
        "presupuesto": 120,
    },
    {
        "clave": "equilibrado",
        "nombre": "Antojo equilibrado",
        "descripcion": "Un plato completo con sabor moderado.",
        "icono": "balance",
        "hambre": 60,
        "picante": 45,
        "presupuesto": 200,
    },
    {
        "clave": "economico",
        "nombre": "Cuidando el gasto",
        "descripcion": "Lo mas rico sin gastar mucho.",
        "icono": "savings",
        "hambre": 55,
        "picante": 50,
        "presupuesto": 90,
    },
    {
        "clave": "compartir",
        "nombre": "Para compartir",
        "descripcion": "Porcion grande para dos personas.",
        "icono": "groups",
        "hambre": 95,
        "picante": 50,
        "presupuesto": 380,
    },
]

# Carta dulce: nombre, descripcion, categoria, saciedad, dulzor, precio, minutos, etiquetas, tipo
POSTRES_Y_BEBIDAS = [
    # Postres
    (
        "Flan Napolitano",
        "Flan cremoso de huevo y vainilla con su caramelo tostado, servido bien frio.",
        "Postres", 45, 75, 65, 5, ["Popular", "Tradicional"], "postre",
    ),
    (
        "Pastel de Tres Leches",
        "Bizcocho esponjoso remojado en tres leches con crema batida y canela encima.",
        "Postres", 60, 85, 85, 5, ["Popular", "Muy dulce"], "postre",
    ),
    (
        "Churros con Chocolate",
        "Churros recien hechos con azucar y canela, con chocolate caliente para remojar.",
        "Postres", 55, 80, 75, 10, ["Popular", "Caliente"], "postre",
    ),
    (
        "Arroz con Leche",
        "Arroz cocido en leche con canela, pasas y un toque de vainilla, tibio o frio.",
        "Postres", 50, 70, 55, 8, ["Tradicional"], "postre",
    ),
    (
        "Gelatina de Mosaico",
        "Cubos de gelatina de colores en crema de leche con un ligero sabor a vainilla.",
        "Postres", 25, 55, 40, 5, ["Economico", "Refrescante"], "postre",
    ),
    (
        "Pan de Elote",
        "Rebanada tibia de pan de elote con su textura humeda y un poco de crema.",
        "Postres", 48, 65, 60, 8, ["Tradicional", "Caliente"], "postre",
    ),
    (
        "Capirotada",
        "Pan dorado en miel de piloncillo con queso, pasas, nuez y platano.",
        "Postres", 65, 80, 70, 12, ["Tradicional", "Bien servido"], "postre",
    ),
    (
        "Buñuelos con Piloncillo",
        "Buñuelos crujientes bañados en miel de piloncillo con canela y anis.",
        "Postres", 40, 85, 50, 8, ["Tradicional", "Muy dulce"], "postre",
    ),
    (
        "Nieve de Garrafa de Limon",
        "Nieve hecha a mano, ligera y bien acida, servida en cono o vasito.",
        "Postres", 20, 60, 45, 3, ["Refrescante", "Economico"], "postre",
    ),
    (
        "Helado Frito con Canela",
        "Bola de helado de vainilla envuelta en masa dorada, con canela y miel.",
        "Postres", 50, 90, 95, 10, ["Muy dulce"], "postre",
    ),
    (
        "Crepas de Cajeta con Nuez",
        "Dos crepas delgadas rellenas de cajeta quemada con nuez tostada y helado.",
        "Postres", 55, 95, 105, 12, ["Popular", "Muy dulce"], "postre",
    ),
    (
        "Fresas con Crema",
        "Fresas frescas rebanadas con crema dulce batida y galleta molida.",
        "Postres", 35, 70, 65, 5, ["Refrescante"], "postre",
    ),
    (
        "Platanos Fritos con Lechera",
        "Platano macho dorado en mantequilla con leche condensada y queso rallado.",
        "Postres", 58, 90, 70, 10, ["Tradicional", "Muy dulce"], "postre",
    ),
    (
        "Dulce de Calabaza en Tacha",
        "Calabaza de castilla cocida en piloncillo con canela, servida en su miel.",
        "Postres", 45, 85, 55, 10, ["Tradicional"], "postre",
    ),
    (
        "Cocada Horneada",
        "Cocada de coco rallado horneada hasta dorar, muy dulce y para llevar.",
        "Postres", 30, 100, 35, 5, ["Economico", "Muy dulce"], "postre",
    ),
    # Bebidas
    (
        "Agua de Horchata",
        "Agua de arroz con canela y vainilla, bien fria y con hielo.",
        "Bebidas", 20, 65, 40, 3, ["Popular", "Refrescante"], "bebida",
    ),
    (
        "Agua de Jamaica",
        "Flor de jamaica hervida y endulzada al gusto, servida con mucho hielo.",
        "Bebidas", 15, 45, 35, 3, ["Refrescante", "Economico"], "bebida",
    ),
    (
        "Agua de Limon con Chia",
        "Limon recien exprimido con chia hidratada, ligera y muy refrescante.",
        "Bebidas", 15, 40, 38, 3, ["Refrescante"], "bebida",
    ),
    (
        "Agua de Tamarindo",
        "Pulpa de tamarindo colada y endulzada, con ese sabor agridulce de siempre.",
        "Bebidas", 15, 55, 38, 3, ["Refrescante", "Economico"], "bebida",
    ),
    (
        "Agua de Melon",
        "Melon licuado con agua y un poco de azucar, suave y fresca.",
        "Bebidas", 18, 50, 40, 3, ["Refrescante"], "bebida",
    ),
    (
        "Chocolate Caliente de Metate",
        "Chocolate de metate batido con leche, espumoso y con su toque de canela.",
        "Bebidas", 30, 70, 55, 6, ["Caliente", "Tradicional"], "bebida",
    ),
    (
        "Atole de Vainilla",
        "Atole espeso de maiz con vainilla, servido bien caliente.",
        "Bebidas", 35, 65, 45, 6, ["Caliente", "Tradicional"], "bebida",
    ),
    (
        "Champurrado",
        "Atole de maiz con chocolate y piloncillo, espeso y reconfortante.",
        "Bebidas", 38, 70, 50, 8, ["Caliente", "Tradicional"], "bebida",
    ),
    (
        "Cafe de Olla",
        "Cafe de grano con piloncillo y canela, preparado en olla de barro.",
        "Bebidas", 10, 45, 40, 5, ["Caliente", "Tradicional"], "bebida",
    ),
    (
        "Cafe Americano",
        "Cafe negro recien colado, sin azucar, para acompanar cualquier postre.",
        "Bebidas", 5, 0, 35, 4, ["Caliente", "Sin picante"], "bebida",
    ),
    (
        "Licuado de Fresa",
        "Fresas con leche licuadas al momento, cremoso y no muy dulce.",
        "Bebidas", 32, 70, 60, 4, ["Refrescante"], "bebida",
    ),
    (
        "Malteada de Chocolate",
        "Malteada espesa de helado de chocolate con crema batida encima.",
        "Bebidas", 35, 85, 75, 5, ["Muy dulce", "Popular"], "bebida",
    ),
    (
        "Limonada Mineral",
        "Agua mineral con limon exprimido y poca azucar, bien burbujeante.",
        "Bebidas", 12, 35, 45, 3, ["Refrescante"], "bebida",
    ),
    (
        "Tepache Artesanal",
        "Bebida fermentada de piña con piloncillo y canela, servida muy fria.",
        "Bebidas", 15, 60, 45, 3, ["Refrescante", "Tradicional"], "bebida",
    ),
    (
        "Te de Canela y Naranja",
        "Infusion de canela con cascara de naranja, ligera y apenas endulzada.",
        "Bebidas", 8, 30, 35, 5, ["Caliente", "Sin picante"], "bebida",
    ),
]
