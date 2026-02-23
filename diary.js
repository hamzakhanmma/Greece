document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("diaryForm");
    const list = document.getElementById("entriesList");

    if (!form) return;

    const entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];

    function render() {
        list.innerHTML = "";
        entries.forEach(e => {
            const div = document.createElement("div");
            div.className = "card";
            div.innerHTML = `<h4>${e.date}</h4><p>${e.text}</p>`;
            list.appendChild(div);
        });
    }

    render();

    form.addEventListener("submit", e => {
        e.preventDefault();
        const date = entryDate.value;
        const text = entryContent.value;

        entries.push({ date, text });
        localStorage.setItem("diaryEntries", JSON.stringify(entries));

        render();
        form.reset();
    });

});
