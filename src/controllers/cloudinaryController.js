// Importerer Cloudinary-konfigurationsfilen
const cloudinary = require('../../config/cloudinaryConfig');

// Definerer en liste over public IDs for billeder, der er gemt i Cloudinary
const publicIds = [
  "Joe billeder/Serrano",        // Billede 1
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

// Funktion til at generere URL'er for billederne i Cloudinary
const listImages = async () => {
  try {
    // Mapper gennem public IDs og genererer en URL for hvert billede
    const imageUrls = publicIds.map((id) => cloudinary.url(id));
    
    // Returnerer en liste af URL'er
    return imageUrls;
  } catch (error) {
    // Logger fejl og smider en undtagelse, hvis noget går galt
    console.error("Fejl under hentning af billeder:", error);
    throw error;
  }
};

// Eksporterer funktionen, så den kan bruges i andre dele af applikationen
module.exports = {
  listImages,
};
