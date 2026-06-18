import { ImagePlus, Images } from "lucide-react";
import { uploadFile } from "../api/uploadApi";

export default function AssetManager({ assets, setAssets }) {
  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.loading("Uploading asset...", { id: "upload" });
      
      // Call your backend API
      const result = await uploadFile(file); 
      
      // Update the global draft state!
      setAssets([...assets, { name: file.name, url: result.url, type: file.type }]);
      
      toast.success("Asset uploaded!", { id: "upload" });
    } catch (error) {
      toast.error("Upload failed", { id: "upload" });
    }
  };

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-white/90 flex items-center gap-2">
          <Images className="w-4 h-4 text-blue-400" />
          Assets
        </h2>
      </div>

      {/* --- Beautiful Custom File Upload Button --- */}
      <label className="group relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/[0.1] rounded-xl hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer overflow-hidden mb-4">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <ImagePlus className="w-6 h-6 text-white/40 group-hover:text-purple-400 transition-colors mb-2" />
          <p className="text-xs text-white/50 group-hover:text-white/80">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
        </div>
        <input type="file" className="hidden" onChange={upload} />
      </label>

      {/* --- Asset Grid --- */}
      {assets?.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {assets.map((asset) => (
            <div key={asset.url} className="group relative border border-white/[0.05] bg-[#050505] rounded-xl p-2 overflow-hidden hover:border-white/[0.1] transition-colors">
              <div className="w-full h-20 bg-white/[0.02] rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                <img src={asset.url} alt={asset.name} className="max-w-full max-h-full object-contain" />
              </div>
              <p className="text-[10px] text-white/50 truncate font-mono px-1">
                {asset.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}