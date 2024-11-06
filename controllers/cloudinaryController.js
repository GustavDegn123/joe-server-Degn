const cloudinary = require('../config/cloudinaryConfig');

const publicIds = [
"Joe billeder/Serano",        // Billede 1
  "Joe billeder/Avocado",       // Billede 2
  "Joe billeder/Tunacado",      // Billede 3
  "Joe billeder/Joes Club",     // Billede 4
  "Joe billeder/Power Shake",   // Billede 5
  "Joe billeder/Pick Me Up",    // Billede 6
  "Joe billeder/Avo Shake",     // Billede 7
  "Joe billeder/Hell of a Nerve", // Billede 8
  "Joe billeder/Americano",     // Billede 9
  "Joe billeder/Iron Man",      // Billede 10
  "Joe billeder/Go Away Doc",   // Billede 11
  "Joe billeder/Cappuccino",    // Billede 12
  "Joe billeder/Espresso",      // Billede 13
  "Joe billeder/Latte"          // Billede 14
];

const listImages = async () => {
  try {
    const imageUrls = publicIds.map((id) => cloudinary.url(id));
    return imageUrls;
  } catch (error) {
    console.error("Fejl under hentning af billeder:", error);
    throw error;
  }
};

module.exports = {
  listImages, 
};
