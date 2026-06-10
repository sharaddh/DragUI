import {
  useState,
  useEffect
} from "react";
import MarketplaceSettings
  from "../components/MarketplaceSettings";
import MonacoEditor
  from "../components/MonacoEditor";
import AssetManager
  from "../components/AssetManager";
import PreviewPanel
  from "../components/PreviewPanel";

import FileExplorer
  from "../components/FileExplorer";
import VersionModal
  from "../components/VersionModal";

import {
  createVersion
}
  from "../api/versionApi";
import ComponentToolbar
  from "../components/ComponentToolbar";

import PropertyBuilder
  from "../components/PropertyBuilder";

import {
  getComponent,
  createComponent,
  updateComponent
}
  from "../api/componentApi";

import toast from "react-hot-toast";
import {
  useParams
}
  from "react-router-dom";

export default function ComponentEditor() {
  const [
    versionOpen,
    setVersionOpen
  ] = useState(false);
  const [
    assets,
    setAssets
  ] = useState([]);
  const [
    propsData,
    setPropsData
  ] = useState([]);
  const [
    marketplace,
    setMarketplace
  ] = useState({

    title: "",

    description: "",

    tags: []

  });
  const [
    files,
    setFiles
  ] = useState([
    {
      name: "Button.jsx",

      code: `
export default function Button(){

 return(

 <button>
  Click
 </button>

 )

}
`
    }
  ]);
  const { id } =
    useParams();
  useEffect(() => {

    if (id) {

      loadComponent();

    }

  }, [id]);
  const loadComponent =
    async () => {

      const data =
        await getComponent(id);

      setFiles([
        {
          name:
            `${data.name}.jsx`,

          code:
            data.code
        }
      ]);

    };
  const [
    selected,
    setSelected
  ] = useState(
    "Button.jsx"
  );

  const current =
    files.find(
      file =>
        file.name ===
        selected
    );
  const saveVersion =
    async (changelog) => {

      try {

        await createVersion(
          id,
          changelog
        );

        toast.success(
          "Version Created"
        );

        setVersionOpen(
          false
        );

      } catch (error) {

        toast.error(
          "Version Failed"
        );

      }

    };
  const updateCode =
    code => {

      setFiles(
        prev =>

          prev.map(
            file =>

              file.name ===
                selected

                ? {
                  ...file,
                  code
                }

                : file
          )
      );

    };
  const
    saveComponent =
      async () => {

        try {

          const payload = {

            name:
              selected.replace(
                ".jsx",
                ""
              ),

            code:
              current.code,

            props:
              propsData,

            assets:
              assets,

            marketplace:
              marketplace

          };

          toast.success(
            "Component Saved"
          );

        } catch (error) {

          console.error(error);

          toast.error(
            "Failed To Save"
          );

        }

      };
  return (

    <div
      className="
 h-screen
 flex
 flex-col
 "
    >

      ComponentToolbar

      <div
        className="
   flex
   flex-1
   "
      >

        <FileExplorer

          files={files}

          selected={selected}

          setSelected={setSelected}

        />

        <div
          className="
   flex-1
   "
        >

          <MonacoEditor

            code={
              current.code
            }

            setCode={
              updateCode
            }

          />

        </div>

        <div
          className="
 w-[500px]
 border-l
 flex
 flex-col
 "
        >

          <div
            className="
  flex-1
  "
          >

            <PreviewPanel
              code={current.code}
            />

          </div>

          <div
            className="h-[500px] overflow-y-auto"
          >

            <PropertyBuilder
              propsData={propsData}
              setPropsData={setPropsData}
            />

            <AssetManager
              assets={assets}
              setAssets={setAssets}
            />

            <MarketplaceSettings

              marketplace={marketplace}

              setMarketplace={setMarketplace}

            />

          </div>

        </div>

      </div>

    </div>

  );

}