//sidebar
const menuItems = document.querySelectorAll(".menu-item");


//=================== SIDEBAR ======================//
const changeActiveItem = () => {
    menuItems.forEach(item => {
        item.classList.remove("active");
    });
}


//fonts
const removeSelector = () => {
    fontSizes.forEach(size => {
        size.classList.remove("active");
    });
}

fontSizes.forEach(size => {
   size.addEventListener("click", () => {
        removeSelector();
        let fontSize;
        size.classList.toggle("active");

        if(size.classList.contains("font-size-1")){
            fontSize = "10px";
            root.style.setProperty(" --sticky-top-left", "5.4rem");
            root.style.setProperty(" --sticky-top-right", "5.4rem");
        }else if(size.classList.contains("font-size-2")){
            fontSize = "14px";
            root.style.setProperty(" --sticky-top-left", "5.4rem");
            root.style.setProperty(" --sticky-top-right", "-7rem");
        }else if(size.classList.contains("font-size-3")){
            fontSize = "16px";
            root.style.setProperty(" --sticky-top-left", "-2rem");
            root.style.setProperty(" --sticky-top-right", "-17rem");
        }else if(size.classList.contains("font-size-4")){
            fontSize = "19px";
            root.style.setProperty(" --sticky-top-left", "-5rem");
            root.style.setProperty(" --sticky-top-right", "-25rem");
        }else if(size.classList.contains("font-size-5")){
            fontSize = "22px";
            root.style.setProperty(" --sticky-top-left", "-10rem");
            root.style.setProperty(" --sticky-top-right", "-33rem");
        }

    document.querySelector("html").style.fontSize = fontSize;
   });


    
});



