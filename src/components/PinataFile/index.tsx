import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";

import { pinata } from "../../utils/pinata/config";
import { CONTRACT_ADDRESS, abi, FunctionNames } from "../../constants/web3";

import styles from "./pinataFile.module.css";
import EditIcon from "../icons/edit";
import CancelIcon from "../icons/cancel";
import Spinner from "../Spinner";

const PinataFile = ({ poolID }: { poolID: `0x${string}` | undefined }) => {
  const { writeContract } = useWriteContract();
  const [inputContent, setInputContent] = useState<string>();
  const [initialContent, setInitialContent] = useState<string>();
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
          setInitialContent(file.data as string);
        }
      } catch (e) {
        console.log(e);
      }
    }

    if (metadataCID) {
      fetchFile();
    } else {
      resetValues();
    }
  }, [metadataCID, poolID]);

  const resetValues = () => {
    setInputContent("");
    setInitialContent("");
    setIsUpdating(false);
    setAllowEdit(false);
  };

  const updateContent = async () => {
    if (initialContent === inputContent) return;
    const timestamp = Date.now();
    const blob = new Blob([inputContent!], { type: "text/plain" });
    const file = new File([blob], `file-${timestamp}.txt`, {
      type: "text/plain",
    });

    try {
      setIsUpdating(true);
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
          onSuccess: (_data, _variables, _context) =>
            setInitialContent(inputContent),

          onError: (error, _variables, _context) =>
            console.log("Something went wrong", JSON.stringify(error, null, 2)),

          onSettled: (_data, _error, _variables, _context) =>
            setAllowEdit(false),
        }
      );
      setIsUpdating(false);
    } catch (e) {
      console.log(e);
      setIsUpdating(false);
      alert("Trouble uploading file");
    }
  };

  const handleChangeAllowEdit = () => {
    setAllowEdit(!allowEdit);
    setInputContent(initialContent);
  };

  const handleUpdateInput = (value: string) => {
    setInputContent(value);
  };

  return (
    <>
      {poolID ? (
        isLoading ? (
          <Spinner />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateContent();
            }}
            className={styles.form}
          >
            <textarea
              value={inputContent}
              onChange={(e) => {
                handleUpdateInput(e.target.value);
              }}
              id="metadata-input"
              disabled={isUpdating}
              readOnly={!allowEdit}
              className={`${styles.textarea} ${!allowEdit && styles.disabled}`}
            />
            <button
              onClick={() => handleChangeAllowEdit()}
              className={styles.editButton}
              type="button"
              data-testid="edit-button"
            >
              {allowEdit ? <CancelIcon /> : <EditIcon />}
            </button>
            {allowEdit && (
              <button type="submit" className={styles.submitButton}>
                {isUpdating ? <Spinner /> : "update metadata "}
              </button>
            )}
          </form>
        )
      ) : (
        <i>no pool selected</i>
      )}
    </>
  );
};

export default PinataFile;
