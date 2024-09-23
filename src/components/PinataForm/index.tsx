import { useState } from "react";
import { pinata } from "../../utils/pinata/config";
import styles from "./pinataForm.module.css";

const PinataForm = () => {
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<string>();

  const uploadFile = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      setUploading(true);
      const keyRequest = await fetch("/api/key");
      const keyData = await keyRequest.json();
      const upload = await pinata.upload
        .file(file)
        .key(keyData.JWT)
        .cidVersion(0);
      //   const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash)
      const cid = upload.IpfsHash;
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(
      e.target?.files?.[0] ? e.target?.files?.[0].name : undefined
    );
    setFile(e.target?.files?.[0]);
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="file"
        id="file-upload"
        onChange={handleChange}
      />
      <label className={styles.customButton} htmlFor="file-upload">
        Choose File
      </label>
      {selectedFile && <span className={styles.fileName}>{selectedFile}</span>}
      <button
        className={styles.button}
        disabled={uploading}
        onClick={uploadFile}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default PinataForm;
