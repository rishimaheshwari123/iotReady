import './App.css';
import React , {useState, useEffect} from 'react';
import Dexie from "dexie";

const App = () => {

  const db = new Dexie("AudioDB");
  db.version(1).stores({
    audios: "name, file"
  })
  db.open().catch((err) => {
      console.log(err.stack || err)
  })

  const [audioName, setName] = useState("");
  const [audioFile, setFile] = useState("");
  const [audios, setAudios] = useState("");

  const getFile = (e) => {
    let reader = new FileReader();
      reader.readAsDataURL(e[0]);
      reader.onload= (e) => {
          setFile(reader.result);
      }
  }

  const getAudioInfo = (e) => {
      e.preventDefault();
      if(audioName !== "" && audioFile !== ""){
          let audio = {
              name: audioName,
              file: audioFile
          }

          db.audios.add(audio).then(async() => {
              let allAudios = await db.audios.toArray();
              setAudios(allAudios);
          });
          
      }
  }

  useEffect(() => {
      const getAudios = async() => {
          let allAudios = await db.audios.toArray();
          setAudios(allAudios);
      }
      getAudios();

  }, [])

  let audioData;

  if(audios.length > 0){
    audioData = <div>
      {
        audios.map(audio => {
          return <div key={audio.name} className="audio-cont">
            <h3 className="audio-name">{audio.name}</h3>
            <audio className="audio" controls src={audio.file} type="audio/mp3">
            </audio>
          </div>
        })
      }
    </div>
  } else {
    audioData = <div>
      <p>No Entries</p>
    </div>
  }

  return (
    <>
      <div className="container">
        <h1 className="h1">Audio App - IoTReady</h1>
        <form onSubmit={getAudioInfo} className="form">
            <label htmlFor="name" className="label">Name</label>
            <input type="text" name="name" id="name" onChange={e => setName(e.target.value)} className="input name"/>
            <label htmlFor="file" className="label">Audio File</label>
            <input type="file" name="file" id="file" onChange={e => getFile(e.target.files)} className="input"/>
          <input type="submit" value="Submit" className="input submit"/>
        </form>
      </div>

      <div className="container audiodata">
        <h1>PlayList</h1>
        {audioData}
      </div>
    </>
  );
}

export default App;
