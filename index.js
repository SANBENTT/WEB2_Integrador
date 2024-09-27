const express = require("express");
const translate  = require("node-google-translate-skidz");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

app.post("/traducir", (req, res) => {
    const { cultura, titulo, dinastia } = req.body;
  
    console.log("Datos recibidos para traducir:", req.body); 
  

    function traducirTexto(texto) {
      return new Promise((resolve, reject) => {
        if (!texto) {
          resolve(""); 
        } else {
          translate({
            text: texto,
            source: "en",
            target: "es"
          }, function (result) {
            console.log(`Resultado de la traducción de '${texto}':`, result); 
            if (result && result.translation) {
              resolve(result.translation);
            } else {
              reject(new Error("Error en la traducción"));
            }
          });
        }
      });
    }
  
   
    Promise.all([traducirTexto(cultura), traducirTexto(titulo), traducirTexto(dinastia)])
      .then(([tradCultura, tradTitulo, tradDinastia]) => {
        console.log("Traducciones completas:", { cultura: tradCultura, titulo: tradTitulo, dinastia: tradDinastia });
        res.json({
          cultura: tradCultura || "Sin Datos",
          titulo: tradTitulo || "Sin Título",
          dinastia: tradDinastia || "Sin Datos"
        });
      })
      .catch((error) => {
        console.error("Error en la traducción:", error);
        res.status(500).json({ error: "Error al traducir los textos" });
      });
  });
  


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
