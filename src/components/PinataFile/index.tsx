import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";

import { pinata } from "../../utils/pinata/config";
import { CONTRACT_ADDRESS, abi, FunctionNames } from "../../constants/web3";

import styles from "./pinataFile.module.css";
import EditIcon from "../icons/edit";
import CancelIcon from "../icons/cancel";
import Spinner from "../Spinner";
import { Address } from "../../types";

const PinataFile = ({ poolID }: { poolID: Address | undefined }) => {
  const { writeContract } = useWriteContract();
  const [isUpdating, setIsUpdating] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);

  const [metadataContent, setMetadataContent] = useState<{
    name: string;
    link: string;
    description: string;
  }>({ name: "", link: "", description: "" });

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
          setMetadataContent(
            file.data as unknown as {
              name: string;
              link: string;
              description: string;
            }
          );
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
    setIsUpdating(false);
    setAllowEdit(false);
  };

  const updateContent = async () => {
    const timestamp = Date.now();
    const blob = new Blob([JSON.stringify(metadataContent)], {
      type: "application/json",
    });
    const file = new File([blob], `${poolID}-${timestamp}.json`, {
      type: "application/json",
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
          // onSuccess: (_data, _variables, _context) =>
          //   setInitialContent(inputContent),

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
            <button
              onClick={() => handleChangeAllowEdit()}
              className={styles.editButton}
              type="button"
              data-testid="edit-button"
            >
              {allowEdit ? <CancelIcon /> : <EditIcon />}
            </button>
            <label htmlFor="name">Name</label>
            <input
              className={styles.input}
              value={metadataContent.name}
              onChange={(e) =>
                setMetadataContent({ ...metadataContent, name: e.target.value })
              }
              placeholder="name"
              id="name"
              disabled={isUpdating}
              readOnly={!allowEdit}
            />
            <label htmlFor="lik">Link</label>
            <input
              className={styles.input}
              value={metadataContent.link}
              onChange={(e) =>
                setMetadataContent({ ...metadataContent, link: e.target.value })
              }
              placeholder="link"
              id="link"
              disabled={isUpdating}
              readOnly={!allowEdit}
            />

            <label htmlFor="description">Description</label>
            <textarea
              value={metadataContent.description}
              onChange={(e) => {
                setMetadataContent({
                  ...metadataContent,
                  description: e.target.value,
                });
              }}
              id="description"
              disabled={isUpdating}
              readOnly={!allowEdit}
              className={`${styles.textarea} ${!allowEdit && styles.disabled}`}
              placeholder="description"
            />

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
  // return (
  //   <>
  //     {poolID ? (
  //       isLoading ? (
  //         <Spinner />
  //       ) : (
  //         <form
  //           onSubmit={(e) => {
  //             e.preventDefault();
  //             updateContent();
  //           }}
  //           className={styles.form}
  //         >
  //           <textarea
  //             value={inputContent}
  //             onChange={(e) => {
  //               handleUpdateInput(e.target.value);
  //             }}
  //             id="metadata-input"
  //             disabled={isUpdating}
  //             readOnly={!allowEdit}
  //             className={`${styles.textarea} ${!allowEdit && styles.disabled}`}
  //           />
  //           <button
  //             onClick={() => handleChangeAllowEdit()}
  //             className={styles.editButton}
  //             type="button"
  //             data-testid="edit-button"
  //           >
  //             {allowEdit ? <CancelIcon /> : <EditIcon />}
  //           </button>
  //           {allowEdit && (
  //             <button type="submit" className={styles.submitButton}>
  //               {isUpdating ? <Spinner /> : "update metadata "}
  //             </button>
  //           )}
  //         </form>
  //       )
  //     ) : (
  //       <i>no pool selected</i>
  //     )}
  //   </>
  // );
};

export default PinataFile;
