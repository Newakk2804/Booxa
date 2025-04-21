const fileInput = document.getElementById('imageUrl');
const previewImage = document.getElementById('preview-image');

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    previewImage.src = imageUrl;
  }
});