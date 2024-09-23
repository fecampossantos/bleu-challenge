import { useEffect, useState } from "react";
import { pinata } from "../../utils/pinata/config";
import { useWriteContract } from "wagmi";
import { abi } from "../../abi";

const PinataFile = ({ cid }: { cid: string }) => {
  const [fileData, setFileData] = useState<any>();

  const [inputContent, setInputContent] = useState<string>();

  const { writeContract } = useWriteContract();
  const CONTRACT_ADDRESS = "0x61FD2dedA9c8a1ddb9F3F436D548C58643936f02";

  const poolID =
    "0x238affe4b714ba820975b049875115ecd14cb1a4000200000000000000000155";

  useEffect(() => {
    async function fetchFile() {
      try {
        const file = await pinata.gateways.get(cid);
        setFileData(file.data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchFile();
  }, [cid]);

  const updateContent = async () => {
    const timestamp = Date.now();
    const blob = new Blob([inputContent!], { type: "text/plain" });
    const file = new File([blob], `file-${timestamp}.txt`, {
      type: "text/plain",
    });

    try {
      //   setUploading(true);
      const keyRequest = await fetch("/api/key");
      const keyData = await keyRequest.json();
      const upload = await pinata.upload
        .file(file)
        .key(keyData.JWT)
        .cidVersion(0);
      const metatadaCID = upload.IpfsHash;
      writeContract(
        {
          abi,
          address: CONTRACT_ADDRESS,
          functionName: "setPoolMetadata",
          args: [poolID, metatadaCID],
        },
        {
          onSuccess: (data, variables, context) =>
            console.log("success", { data, variables, context }),
          onSettled: (data, error, variables, context) =>
            console.log("settled", { data, error, variables, context }),
          onError: (error, variables, context) =>
            console.log("error", { error, variables, context }),
        }
      );
      //   setUploading(false);
    } catch (e) {
      console.log(e);
      //   setUploading(false);
      alert("Trouble uploading file");
    }
  };

  return (
    <div>
      {JSON.stringify(fileData)}
      <input
        value={inputContent}
        onChange={(e) => setInputContent(e.target.value)}
      ></input>
      <button onClick={() => updateContent()}>atualizar</button>
    </div>
  );
};

export default PinataFile;
