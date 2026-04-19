// Bootstrap Custom Validation + Custom Logic

(() => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {

      const price = document.getElementById("price");
      const imageUrl = document.getElementById("imageUrl");

      // ✅ Price validation (> 0)
      if (price.value <= 0) {
        price.setCustomValidity("Price must be greater than 0");
      } else {
        price.setCustomValidity("");
      }

      // ✅ Image URL validation
        const imageUrl = document.getElementById("imageUrl");

// Allow empty (means keep old image)
        const urlPattern = /^(https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg))(\?.*)?$/i;

        if (imageUrl.value && !urlPattern.test(imageUrl.value)) {
  imageUrl.setCustomValidity("Enter a valid image URL");
        } else {
         imageUrl.setCustomValidity("");
        }

      // ✅ Bootstrap validation
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');

    }, false);
  });
})();