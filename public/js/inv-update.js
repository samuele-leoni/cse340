const form = document.querySelector("form")
form.addEventListener("change", function () {
    const updateBtn = document.querySelector("#submit")
    updateBtn.removeAttribute("disabled")
})