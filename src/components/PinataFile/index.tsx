import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";

import { pinata } from "../../utils/pinata/config";
import { CONTRACT_ADDRESS, abi, FunctionNames } from "../../constants/web3";

import styles from "./pinataFile.module.css";
import EditIcon from "../icons/edit";
import CancelIcon from "../icons/cancel";

const PinataFile = ({ poolID }: { poolID: `0x${string}` | undefined }) => {
  const { writeContract } = useWriteContract();
  const [inputContent, setInputContent] = useState<string>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);

  const {
    data: metadataCID,
    isError,
    isLoading,
    error,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: FunctionNames.POOL_METADATA_CID_MAP,
    args: [poolID],
  });

  useEffect(() => {
    async function fetchFile() {
      try {
        const file = await pinata.gateways.get(metadataCID!);
        if (file && "data" in file) {
          setInputContent(file.data as string);
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (metadataCID) fetchFile();
  }, [metadataCID]);

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
          functionName: FunctionNames.SET_POOL_METADATA,
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateContent();
      }}
      className={styles.form}
    >
      <textarea
        value={inputContent}
        onChange={(e) => setInputContent(e.target.value)}
        id="metadata-input"
        disabled={isUpdating}
        readOnly={!allowEdit}
      />
      <button
        onClick={() => setAllowEdit(!allowEdit)}
        className={styles.editButton}
      >
        {allowEdit ? <CancelIcon /> : <EditIcon />}
      </button>
      {allowEdit && (
        <button type="submit" className={styles.submitButton}>
          atualizar metadata
        </button>
      )}
    </form>
  );
};

export default PinataFile;
