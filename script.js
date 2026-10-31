// FoodBridge AI - Homepage JavaScript

document.addEventListener("DOMContentLoaded", function () {
// Get the HTML elements
const mealsCount = document.getElementById("mealsCount");
const donationsCount = document.getElementById("donationsCount");
const wasteCount = document.getElementById("wasteCount");
const startDonation = document.getElementById("startDonation");
const findFoodButton = document.getElementById("findFoodButton");
const message = document.getElementById("message");
const donationList=document.getElementById("donationList");

// Read saved donations from localStorage
function getDonations() {
    try {
        const savedDonations = localStorage.getItem("foodbridgeDonations");
        const donations = savedDonations
            ? JSON.parse(savedDonations)
            : [];

        return Array.isArray(donations) ? donations : [];
    } catch (error) {
        console.error("Could not load donations:", error);
        return [];
    }
}

// Update homepage statistics
function updateStatistics() {
    const donations = getDonations();

    const totalMeals = donations.reduce(function (total, donation) {
        return total + (Number(donation.quantity) || 0);
    }, 0);

    if (mealsCount) {
        mealsCount.textContent = totalMeals.toLocaleString();
    }

    if (donationsCount) {
        donationsCount.textContent = donations.length.toLocaleString();
    }

    if (wasteCount) {
        // This represents servings listed in this demo,
        // not independently verified food waste reduction.
        wasteCount.textContent = totalMeals.toLocaleString();
    }
}

// Donate button
if (startDonation) {
    startDonation.addEventListener("click", function () {
        message.textContent =
            "The food donation form is our next feature. We're building it now!";
        document.getElementById("find-food").scrollIntoView({
            behavior: "smooth"
        });
    });
}

// Find Food button
if (findFoodButton) {
    findFoodButton.addEventListener("click", function () {
        const donations = getDonations();

        donationList.innerHTML = "";

        if (donations.length === 0) {
            message.textContent = "No food donations available yet.";
            return;
        }

        message.textContent =
            "Available Food Donations: " + donations.length;

        donations.forEach(function (donation) {
            const card = document.createElement("div");
            card.className = "donation-card";

            const title = document.createElement("h3");
            title.textContent = donation.foodName;

            const details = document.createElement("p");
            details.textContent =
                "Category: " + donation.category +
                " | Quantity: " + donation.quantity + " meals";

            const donor = document.createElement("p");
            donor.textContent = "Donor: " + donation.donorName;

            const location = document.createElement("p");
            location.textContent = "Location: " + donation.location;

            const deadline = document.createElement("p");
            deadline.textContent =
                "Pickup Deadline: " + donation.pickupDeadline;

            card.append(title, details, donor, location, deadline);
            donationList.appendChild(card);
        });
    });
}

// Refresh statistics when another tab changes saved data
window.addEventListener("storage", function (event) {
    if (event.key === "foodbridgeDonations") {
        updateStatistics();
    }
});

// Show current statistics
updateStatistics();

// Handle food donation form
const donationForm = document.getElementById("donationForm");

if (donationForm) {
    donationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const foodName = document.getElementById("foodName").value.trim();
        const foodCategory = document.getElementById("foodCategory").value;
        const quantity = Number(document.getElementById("quantity").value);
        const donorName = document.getElementById("donorName").value.trim();
        const location = document.getElementById("location").value.trim();
        const pickupDeadline = document.getElementById("pickupDeadline").value;

        if (!foodName || !foodCategory || !donorName ||
            !location || !pickupDeadline || quantity <= 0) {
            alert("Please enter all donation details correctly.");
            return;
        }

        if (new Date(pickupDeadline) <= new Date()) {
            alert("Please select a future pickup deadline.");
            return;
        }

        const donations = getDonations();

        const newDonation = {
            id: Date.now(),
            foodName: foodName,
            category: foodCategory,
            quantity: quantity,
            donorName: donorName,
            location: location,
            pickupDeadline: pickupDeadline
        };

        donations.push(newDonation);

        localStorage.setItem(
            "foodbridgeDonations",
            JSON.stringify(donations)
        );

        alert("Food donation added successfully!");

        donationForm.reset();
        updateStatistics();
    });
}
});