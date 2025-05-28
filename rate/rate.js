document.addEventListener("DOMContentLoaded", () => {
    const rateDisplay = document.getElementById("current-rate");
    const rateForm = document.getElementById("rate-form");
    const newRateInput = document.getElementById("new-rate");

    const { updateHourlyRate, getHourlyRate } = require('../database');

    function displayRate() {
        getHourlyRate((err, rows) => {
            if (err) {
                console.error("Failed to fetch rate:", err);
                rateDisplay.textContent = "Error";
                return;
            }
            const rate = rows[0]?.rate ?? 0;
            rateDisplay.textContent = parseFloat(rate).toFixed(2);
        });
    }

    rateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newRate = parseFloat(newRateInput.value);
        if (!isNaN(newRate) && newRate > 0) {
            updateHourlyRate(newRate, (err) => {
                if (err) {
                    console.error("Failed to update rate:", err);
                    return;
                }
                displayRate();
                newRateInput.value = "";
            });
        }
    });

    displayRate();
});
