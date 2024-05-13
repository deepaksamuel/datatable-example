var express = require('express');
const cors = require('cors') 
const sqlite3 = require('sqlite3').verbose()





// database creation and readout
const db = new sqlite3.Database('./g4_database.db');

// enable for writing
// db.serialize(() => {
//     db.run('CREATE TABLE IF NOT EXISTS g4_data (eventID INT, detID INT, pid INT, x FLOAT, y FLOAT, z FLOAT, t FLOAT, E FLOAT)')


//     const stmt = db.prepare('INSERT INTO g4_data VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
  
//     for (let i = 0; i < 100; i++) {
//       stmt.run(`${i}`, 1, 11, 999, 999, 999,999,999)
//     }
  
//     stmt.finalize()
  
//     db.each('SELECT rowid AS id, eventID, detID FROM g4_data', (err, row) => {
//       console.log(`${row.eventID}: ${row.detID}`)
//     })
//   })
// db.close()






var app = express();

app.use(cors());
app.use(express.json());

let corsOptions = { 
  origin : ['http://127.0.0.1:5500'], 
} 
// app.options('*', cors()) ;
app.use(cors(corsOptions)); 



app.use(function(req, res, next) {
  console.log("use received");
  // res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // update to match the domain you will make the request from
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.send("");
  console.log(req.body);
  next();
});


// Function to execute a query and return results (replace with your desired query)
const getData = (query) => {
    return new Promise((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

app.get('/datatable', async(req, res) => {
    console.log("get datatable received");
    try {
        // const data = await getData('SELECT eventID, detID, pid, x, y, z, t FROM g4_data'); // Replace with your specific query

        const data = await getData('SELECT * FROM g4_data'); // Replace with your specific query

        //res.json(data);
        const formattedData = {
            draw: req.query.draw, // Echo the draw counter sent by DataTables
            recordsTotal: data.length,//data.length,
            recordsFiltered: 400,  // Assuming all data is returned (adjust if filtering on server)
            data: data
          };
         
          res.json(formattedData); 
        //   console.log(formattedData)   ;
          console.table(data);

      } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data');
      }
  });
  



app.post('/', function (req, res) {
  console.log("post received");
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  console.log(req.body);

  const child_process = require('child_process');
  child_process.execFile('./a.out', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  res.send({g4output: 'running' });
  console.log(data.toString());
});
});

app.options('/', function (req, res) {
  console.log('options');

});


app.listen(3000,'127.0.0.1', function () {
  console.log('Example app listening on port 3000!');
});

