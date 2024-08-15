import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3, 0, 3),
  },
}));

type CSVFileImportProps = {
  url: string,
  title: string
};

export default function CSVFileImport({url, title}: CSVFileImportProps) {
  const classes = useStyles();
  const [file, setFile] = useState<any>();

  const onFileChange = (e: any) => {
    console.log(e);
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
    setFile(files.item(0));
  };

  const removeFile = () => {
    setFile('');
  };

  const uploadFile = async (e: any) => {
      // Get the presigned URL
      const authorizationToken = localStorage.getItem('authorization_token');
      const headers = {Authorization: `Basic ${authorizationToken}`};
      try {
        const response = await axios({
          method: 'GET',
          url,
          headers,
          params: {
            name: encodeURIComponent(file.name)
          }
        })

        console.log('File to upload: ', file.name)
        console.log('Uploading to: ', response.data)
        const result = await fetch(response.data.signedUrl, {
          method: 'PUT',
          body: file,
        });
        /*const result = await axios({
          url: response.data.signedUrl,
          method: 'PUT',
          headers: { "Content-Length": new Blob([file]).size }
        })*/
        console.log('Result: ', result)
        alert('CSVFileImport function success: file uploaded!')
        setFile('');
      } catch (e) {
        console.log(`CSVFileImport function error:${authorizationToken} : headers: ${JSON.stringify(headers)} ${JSON.stringify(e)}`);
        // alert('CSVFileImport function error: Unauthorized: Please check your credentials and try again.');
      }
    }
  ;

  return (
    <div className={classes.content}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
          <input type="file" onChange={onFileChange}/>
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </div>
  );
}
