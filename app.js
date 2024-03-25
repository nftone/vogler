const checkForm = document.getElementById("check-form");
const resultDiv = document.getElementById("result");

checkForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const addressInput = document.getElementById("address-input");
  const address = addressInput.value.trim();
  if (!address) {
    resultDiv.textContent = "Please enter a valid Bitcoin address.";
    return;
  }
  try {
    const ownedAssets = await checkOwnership(address);
    if (ownedAssets.length === 0) {
      resultDiv.textContent = "You do not own any of the assets.";
    } else {
      resultDiv.innerHTML = `You own the following assets:<br>${ownedAssets.join(
        "<br>"
      )}`;
    }
  } catch (error) {
    console.error(error);
    resultDiv.textContent =
      "An error occurred while checking ownership. Please try again later.";
  }
});

const checkOwnership = async (address) => {
  const ownedAssets = [];
  for (const creation of creations) {
    const owner = await findOwnerByTxHash(creation.h);
    if (owner === address) {
      ownedAssets.push(creation.name);
    }
  }
  return ownedAssets;
};
