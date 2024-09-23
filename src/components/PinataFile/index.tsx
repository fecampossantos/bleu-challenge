import { useEffect, useState } from "react";
import { pinata } from "../../utils/pinata/config";

const PinataFile = ({ cid }: { cid: string }) => {
  const [fileData, setFileData] = useState<any>();

  useEffect(() => {
    async function fetchFile() {
      const file = await pinata.gateways.get(
        "bafkreidol3ijac4wfx246ozunvo3gvfnzyoczjpsgugimvesdidff5zum4"
      );
      console.log(file);
      setFileData(file.data);
    }
    fetchFile();
  }, [cid]);
  return <div>{JSON.stringify(fileData)}</div>;
};

export default PinataFile;
