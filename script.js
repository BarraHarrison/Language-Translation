// DOM Elements
const selectTag = document.querySelectorAll("select");
const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".translated-text");
const exchangeIcon = document.querySelector(".exchange");
const translateButton = document.querySelector("button");
const icons = document.querySelectorAll(".row i");


selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        // selecting English as default from langauge and Korean as the trnaslated language
        let selected;
        if(id == 0 && country_code == "en-US") {
            selected = "selected";
        } else if (id == 1 && country_code == "ko-KR") {
            selected = "selected";
        }

        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option); // adding options tag inside select tag
    }
});


exchangeIcon.addEventListener("click", () => {
    // exchanging textarea and select tag values
    let tempText = fromText.value,
    tempLang = selectTag[0].value;
    fromText.value = toText.value,
    selectTag[0].value = selectTag[1].value;
    toText.value = tempText;
    selectTag[1].value = tempLang;
});


translateButton.addEventListener("click", () => {
    let text = fromText.value,
    translateFrom = selectTag[0].value, // getting fromSelect tag value
    translateTo = selectTag[1].value; // getting translated text tag value

    if(!text) return;
    toText.setAttribute("placholder", "Translating....");

    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`; // myMemoryTranslated API
    // fetching api response and returning it by parsing it into a JS object
    // then method receives that obj
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placholder", "Translation");
    });
});


icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains("fa-copy")) {
            // if clicked icon has from ID, copy the from textArea value
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value); // writeText writes the specified text string to the system clipboard
            } else {
                // else copy toText textArea value
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value); // speechSynthesisUtterance represents a speech request
                utterance.lang = selectTag[0].value; // setting utterance lang to fromSelect tag value
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value; // setting utterance lang to toSelect tag value
            }
            speechSynthesis.speak(utterance); // speak the passed utterance
        };
    });
});