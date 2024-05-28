const menu = [
    {
        product: "Hamburguesa grande",
        price: 13.50,
        dinnerPriceMod: 2,
        tags: ["lunch", "dinner", "specials", "burger"]
    },
    {
        product: "Gazpacho",
        price: 11.75,
        dinnerPriceMod: 2,
        tags: ["lunch", "dinner", "specials", "burger"]
    },
    {
        product: "Salad",
        price: 8.50,
        dinnerPriceMod: 2,
        tags: ["lunch", "dinner", "specials", "salad"]
    },
    {
        product: "Paella",
        price: 11.00,
        dinnerPriceMod: 2,
        tags: ["lunch", "dinner", "specials", "salad"]
    },
    {
        product: "Churros con chocolate",
        price: 8.50,
        tags: ["breakfast", "specials"]
    },
    {
        product: "Chorizo",
        price: 9.00,
        tags: ["breakfast", "specials"]
    },
    {
        product: "Empanadas de atun",
        price: 8.50,
        tags: ["breakfast", "specials"]
    },
    {
        product: "Gambas al ajillo",
        price: 3.50,
        tags: ["lunch", "dinner", "sides"]
    },
    {
        product: "Tostas de tomate y jamón",
        price: 4.00,
        tags: ["breakfast", "lunch", "dinner", "sides"]
    },
    {
        product: "Tortilla de patatas",
        price: 3.00,
        tags: ["breakfast", "sides"],
        description: "The Spanish omelette"
    },
    {
        product: "Pan con tomate",
        price: 1.50,
        tags: ["breakfast", "drinks"]
    },
    {
        product: "Vino",
        price: 4.00,
        tags: ["lunch", "dinner", "drinks"]
    },
    {
        product: "Agua de Soda",
        price: 2.00,
        tags: ["lunch", "dinner", "drinks"],
        description: "Free refills all day!"
    },
    {
        product: "Smoothie",
        price: 3.00,
        tags: ["lunch", "dinner", "drinks"]
    },
    {
        product: "Zumo de naranja",
        price: 3.00,
        tags: ["breakfast", "drinks"],
        description: "Cascading Orange Juice-Free refill with order."
    },
    {
        product: "Cafe con leche",
        price: 3.00,
        tags: ["breakfast", "drinks"],
        description: "Que tengas un feliz día hoy! - Have a happy day today!"
    },
]

const waitressNameBank = ["Sofía", "Alba", "Daniela", "Ainhoa", "Fabio", "Xavi"];


var customerOrderList = [];
var currentMenuCategory = "";
var menuActive = false;
var waitressName = generateWaitress();
var totalPayment = 0;


function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function setMenuCategory(menuType) {
    setSpecialsCategory(menuType);
    renderMenu("specials", menuType);
    renderMenu("drinks", menuType);
    renderMenu("sides", menuType);
    
    renderOrderList();
    toggleMenu();
    let hideList = document.querySelectorAll(".intro-menu");
    for (var i = 0; i < hideList.length; i++) {
        hideList[i].classList.add('toggle-visible');
    }
    serviceBark("intro");
}


function setSpecialsCategory(menuType) {
    currentMenuCategory = menuType;
    // document.getElementById("header-specials").textContent = `<h2>specials("${menuType}");</h2>`;
    const newText = document.createTextNode(`--Especiales-Specials("${menuType}")--`);
    const newHeading = document.createElement("h2");
    newHeading.appendChild(newText);
    document.getElementById("header-specials").appendChild(newHeading);
}


function toggleMenu() {
    const myMenu = document.querySelector('#menu-display');
    if (menuActive) {
        myMenu.classList.toggle('toggle-visible');
        menuActive = false;
    } else {
        myMenu.classList.toggle('toggle-visible');
        menuActive = true;
    }
}


function getItemPrice(item) {
    return item.price + ('dinnerPriceMod' in item && currentMenuCategory === 'dinner' ? item.dinnerPriceMod : 0);
}


function getItemDesc(item) {
    return 'description' in item ? item.description : "";
}


function buildDiv({ divID = '', divClass = '', divText = null }) {
    const newDiv = document.createElement("div");
    newDiv.className = divClass;
    newDiv.id = divID;
    if (divText) {
        const newText = document.createTextNode(divText);
        newDiv.appendChild(newText);
    }
    return newDiv;
}


function renderMenu(itemType, menuCategory) {
    var idListTag = "list-" + itemType;
    for (var item in menu) {
        if (menu[item].tags.includes(itemType) && menu[item].tags.includes(menuCategory)) {

            const menuAppended = document.getElementById(idListTag);
            const newItemDiv = buildDiv({ divClass: "menu-item", divID: `add-${item}` });
            newItemDiv.appendChild(buildDiv({ divClass: "item-name", divText: `${menu[item].product}`}));
            newItemDiv.appendChild(buildDiv({ divClass: "item-price", divText: `€${getItemPrice(menu[item]).toFixed(2)}`}));
            newItemDiv.appendChild(buildDiv({ divClass: "item-desc", divText: `${getItemDesc(menu[item])}`}));
            newItemDiv.addEventListener("click",function(){addMenuItem(this.id)});
            menuAppended.appendChild(newItemDiv);
        }
    }
}


function renderOrderList() {
    var orderListHTML = document.getElementById("order-list-tag");
    var totalPaymentOutput = 0;
    var deleteNode = orderListHTML.lastElementChild;
    while (deleteNode) {
        orderListHTML.removeChild(deleteNode);
        deleteNode = orderListHTML.lastElementChild;
    }

    if (customerOrderList.length > 0) {
        document.getElementById("checkout-btn").classList.remove("toggle-visible");
        document.getElementById("reset-btn").classList.remove("toggle-visible");

        for (var item in customerOrderList) {
            totalPaymentOutput += getItemPrice(customerOrderList[item]);

            const newOrderDiv = buildDiv({ divClass: "order-item" })
            newOrderDiv.appendChild(buildDiv({ divClass: "order-product", divText: `${customerOrderList[item].product}` }));
            newOrderDiv.appendChild(buildDiv({ divClass: "order-price", divText: `€${getItemPrice(customerOrderList[item]).toFixed(2)}` }));
            const trashIcon = document.createElement("i");
            trashIcon.className = "order-remove far fa-trash-alt";
            trashIcon.id = `del-${item}`;
            trashIcon.addEventListener("click",function() {delOrderItem(this.id)});
            newOrderDiv.appendChild(trashIcon);

            orderListHTML.appendChild(newOrderDiv);
        }
    } else {
        document.getElementById("checkout-btn").classList.add("toggle-visible");
        document.getElementById("reset-btn").classList.add("toggle-visible");
        orderListHTML.appendChild(buildDiv({ divClass: "please-order-text", divText: "(No items in cart.)" }))
    }
    document.getElementById("total-payment").textContent = `€${totalPaymentOutput.toFixed(2)}`;
}


function addMenuItem(itemID) {
    let itemIndex = itemID.substring(itemID.indexOf("-") + 1);
    customerOrderList.push(menu[itemIndex]);

    renderOrderList();
    serviceBarkCategory(menu[itemIndex], "breakfast");
    serviceBarkCategory(menu[itemIndex], "burger");
    serviceBarkCategory(menu[itemIndex], "salad");
    serviceBarkCategory(menu[itemIndex], "sides");
    serviceBarkCategory(menu[itemIndex], "drinks");
    console.log(customerOrderList);
}


function delOrderItem(itemID) {
    let delItemIndex = itemID.substring(itemID.indexOf("-") + 1);
    if (confirm(`¿Estás seguro de que quieres eliminar los ${customerOrderList[delItemIndex].product} de tu pedido? Golpea OK para confirmar.\r\nAre you sure you want to delete ${customerOrderList[delItemIndex].product} from your order? Hit OK to confirm.`)) {
        customerOrderList.splice(delItemIndex, 1);
        renderOrderList();
        serviceBark("delete");
    }
}


function delOrderAll() {
    if (confirm(`¿Estás seguro de que quieres eliminar todo tu pedido? Golpea OK para confirmar.\r\nAre you sure you want to delete your entire order? Hit OK to confirm.`)) {
        customerOrderList = [];
        renderOrderList();
        serviceBark("deleteAll");
    }
}


function checkoutButton() {
    if (customerOrderList.length > 0) {
        for (var item in customerOrderList) {
            totalPayment += getItemPrice(customerOrderList[item]);
        }
        barkTable.checkout[0] = `¡Perfecto! ¡Lo comenzaremos de inmediato! Tu total sale a €${totalPayment.toFixed(2)}\r\n\r\nPerfect! We'll get that started for you right away! Your total comes out to €${totalPayment.toFixed(2)}\r\n\r\nMe alegraría mucho si quieres dejar una pequeña propina.\r\n\r\nI would be very glad if you want to leave a small tip.`;
        serviceBark("checkout");
        toggleMenu();
        document.getElementById("checkout-btn").classList.add("toggle-visible");
        document.getElementById("reset-btn").classList.add("toggle-visible");
    } else {
        alert("You need at least 1 item in your cart to check out.");
    }
}


function generateWaitress() {
    var idxName = getRandInt(1, waitressNameBank.length) - 1;
    return waitressNameBank[idxName];
}


function serviceBark(eventType) {
    var barkIndex = getRandInt(1, barkTable[eventType].length) - 1;
    document.getElementById("server-chat-box").textContent = `${waitressName.toUpperCase()} DICE-SAYS:\r\n\r\n"` + barkTable[eventType][barkIndex] + '"';
}


function serviceBarkCategory(menuItem, category) {
    if (menuItem.tags.includes(category)) {
        serviceBark(category);
    }
}

//"ali.\r\n\r\n veli.",

const barkTable = {
    intro: [
        `¡Hola! Mi nombre es ${waitressName} y hoy seré tu servidor digital.\r\n\r\nHello there! My name is ${waitressName} and I'll be your digital server today.
        \r\nTómese el tiempo para ver nuestras ofertas especiales de hoy a la derecha. Resalte y haga clic en cualquier artículo que desee agregar a su carrito.
       \r\nPlease take the time to look over our specials today on the right. Highlight and click any items you'd like to add to your basket.`
    ],

    delete: [
        "No te preocupes, olvidaremos que alguna vez intentaste pedir eso.\r\n\r\nNot to worry, we'll just forget you ever tried to order that.",
        "¿Estás absolutamente seguro? Me han dicho que los nuestros son los mejores de todo el país.\r\n\r\n Are you absolutely sure? I've been told ours are the best in the whole country.",
        "Muy bien, lo borraré de la lista. ¿Qué más te gustaría pedir?\r\n\r\n Alright, I'll scratch that one off the list. What else would you like to order?"
       
    ],

    checkout: [
        "SPECIAL CASE - STRING MUST BE UPDATED FROM CHECKOUT FUNCTION"
    ],

    breakfast: [
        "¡Excelente manera de empezar el día! ¡No te olvides de nuestras tazas chocolate recién hechas!\r\n\r\n Great way to start the day! Don't forget about our freshly brewed chocolate cups!",
        "Recién salido de la cocina, ¡lo prometo! Recomiendo nuestros empanadas como acompañamiento.\r\n\r\n Fresh from the kitchen, I promise! I recommend our empanadas as a side.",
        "¿Alguna vez has cuestionado tus elecciones de vida estando despierto tan temprano? Te garantizo que ese plato traerá la claridad que tanto necesitas a tu día.\r\n\r\nEver question your life choices by being awake this early? I guarantee that dish will bring some much needed clarity to your day."
    ],

    burger: [
        "Esa es una hamburguesa. Las hamburguesas son sabrosas. Lo siento, la pereza de mi creador se manifiesta ocasionalmente en momentos cruciales. Espero que no me culpes.\r\n\r\n That is a burger. Burgers are tasty. Sorry, my creator's laziness is occasionally on display at crucial moments. I hope you don't blame me.", 
        "Si alguna vez la hamburguesa estuvo congelada, te garantizo que no fue en ESTE establecimiento.\r\n\r\n If the patty was ever frozen, I guarantee it wasn't at THIS establishment",
        "Hecho con vaca real, ¡lo creas o no!\r\n\r\n Made with real cow, believe it or not!",
        "Tenemos una barra de condimentos completa justo allí si necesitas algún aderezo.\r\n\r\n We've got a full condiments bar just over there if you need any toppings."
        
    ],

    salad: [
        "¡Gran elección! ¡Tengo que ver tu figura de niña después de todo!\r\n\r\n Great choice! Gotta watch your girlish figure after all!",
        "¿Has tenido una de nuestras ensaladas antes? Están tan abundantes que la mayoría de las personas toman un contenedor para llevar.\r\n\r\n Have you had one of our salads before? They're so filling that most people take a to-go container.",
        "¡Buena elección! Traeré pimienta que pueda moler recién en tu preferencia.\r\n\r\n Good choice! I'll be bringing pepper that I can freshly grind to your preference.",
        "No sé cuál de nuestras opciones de ensalada me gustan más. Ambos son solo divinos.\r\n\r\n I don't know which of our salad choices I like better. They're both just divine.",
    ],

    drinks: [
        "¡Te lo traeré helado una vez que hayamos terminado con el resto de tu pedido!\r\n\r\n I'll bring it to you ice cold once we're done with the rest of your order!"
    ],

    sides: [
        "¿Alguna salsa para acompañar? Sin cargo adicional.\r\n\r\n Any sauces on the side? No extra charge.",
        "No puedo tener suficiente, ¿eh? Esa es una excelente elección del lado.\r\n\r\n Just can't get enough, huh? That's an excellent choice of side.",
        
    ],

    deleteAll: [
        "Muy bien, he triturado toda la página de pedidos, lista para comenzar desde cero. ¿Qué le gustaría?\r\n\r\nAlright, I've shredded the entire order page, ready to start from scratch. What would you like?",
        "1 ... 2 ... y ... ¡POOF! Su indecisión no se convertirá en un problema hoy.\r\n\r\n 1... 2... and.... POOF! Your indecisiveness shall not become a problem today."
    ]
};

'use strict';

var moment = require('moment');

/**
 * Returns a string element with a footer and updating year
 * @param {string} name
 * @return {string}
 **/
exports.footer = function (name) {
    return "Copyright " + moment().format('YYYY') + " " + name + " All rights reserved";
};

window.onload= function () {
    var footer = document.getElementById("footer")
    footer.innerText= "Mustafa"
};
