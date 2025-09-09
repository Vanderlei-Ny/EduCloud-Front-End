import { useState, useEffect } from "react";

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles(){
    try {
      const res = await fetch("/api/files/");
      if (res.ok) {
        const data = await res.json();
        setFiles(data || []);
      } else {
        console.warn("Could not load files");
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!arquivo) {
      alert("Selecione um arquivo antes de enviar.");
      return;
    }
    
    const maxSize = 10 * 1024 * 1024;
    if (arquivo.size > maxSize) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000); 
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file_upload", arquivo);
      if (descricao) formData.append("description", descricao);
      if (tipo) formData.append("type", tipo);

      const res = await fetch("/api/files/1/upload/", {
        method: "POST",
        body: formData,
      });

      if (res.ok || res.status === 201) {
        setDescricao("");
        setTipo("");
        setArquivo(null);
        fetchFiles();
        alert("Arquivo enviado com sucesso!");
      } else {
        const txt = await res.text();
        alert("Erro ao enviar: " + txt);
      }
    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      setArquivo(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-10 min-h-screen bg-white">
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-[#FFB627] border-2 border-[#002B3D] rounded-2xl p-4 shadow-lg max-w-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#002B3D] rounded-full p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[#002B3D] text-lg">Arquivo muito grande!</h3>
              <p className="text-[#002B3D] text-sm">O arquivo não pode ter mais de 10MB.</p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="ml-auto text-[#002B3D] hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-3 p-5">
      <h1 className="text-3xl font-bold text-[#002B3D] mb-6">Upload de arquivos</h1>
      <img
              src="archive.svg"
              alt="Seta"
              className="w-8 h-8"
            />
      </div>

      <form
        onSubmit={handleUpload}
        className="bg-[#42A5DB] p-6 rounded-2xl mb-8 flex flex-col gap-4"
      >
        <div className="flex gap-4 cursor-pointer">
          <select
            className="p-3 rounded-xl w-1/2 cursor-pointer"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="" className="bg-white text-white">Selecione o tipo do arquivo</option>
                    <option value="pdf" className="bg-gray-800 text-white">📄 PDF</option>
                    <option value="doc" className="bg-gray-800 text-white">📝 Word</option>
                    <option value="img" className="bg-gray-800 text-white">🖼️ Imagem</option>
          </select>
          <input
            type="text"
            placeholder="Descreva o arquivo"
            className="p-3 rounded-xl w-1/2"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        {/* Área de Upload Moderna */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragOver
              ? 'border-[#FFB627] bg-[#FFB627]/10 scale-105'
              : 'border-[#002B3D] hover:border-[#42A5DB] hover:bg-[#42A5DB]/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />
          
          {arquivo ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <div className="bg-[#002B3D] rounded-full p-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="font-semibold text-[#002B3D] text-lg">{arquivo.name}</p>
                <p className="text-[#002B3D]/70 text-sm">{formatFileSize(arquivo.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setArquivo(null);
                  document.getElementById('file-input').value = '';
                }}
                className="text-[#002B3D] hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-xs">Remover</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="bg-[#42A5DB] rounded-full p-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-[#002B3D] font-semibold text-lg">
                  {isDragOver ? 'Solte o arquivo aqui' : 'Arraste e solte seu arquivo aqui'}
                </p>
                <p className="text-[#002B3D]/70 text-sm mt-1">
                  <span className="text-[#42A5DB] font-semibold">clique para selecionar</span>
                </p>
                <p className="text-[#002B3D]/50 text-xs mt-2">
                  Máximo 10MB • PDF, Word, Imagens
                </p>
              </div>
            </div>
          )}
        </div>
         <div className="flex justify-center">
           <button 
             disabled={loading} 
             className="group text-center relative px-12 py-4 bg-gradient-to-r from-[#FFB627] to-[#FF8C00] hover:from-[#FF8C00] hover:to-[#FFB627] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-[#42A5DB]/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
           >
             <span className="relative z-10 flex items-center justify-center gap-3">
               {loading ? (
                 <>
                   <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Enviando...
                 </>
               ) : (
                 <>
                   <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                   </svg>
                   Enviar Arquivo
                 </>
               )}
             </span>
             <div className="absolute inset-0 bg-gradient-to-r from-[#42A5DB] to-[#1E40AF] rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
           </button>
         </div>
      </form>
      <h2 className="text-3xl font-bold text-black">Arquivos na Plataforma</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files && files.length ? files.map((file, index) => (
          <div key={file.id || index} className="bg-[#FFB627] p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow min-h-[200px]">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-[#002B3D] rounded-full p-2 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#002B3D] text-lg break-words overflow-hidden" 
                   style={{
                     display: '-webkit-box',
                     WebkitLineClamp: 2,
                     WebkitBoxOrient: 'vertical',
                     wordBreak: 'break-word'
                   }}>
                  {file.filename || file.name || "Arquivo"}
                </p>
                <p className="text-[#002B3D]/70 text-sm mt-1">
                  {file.type && `Tipo: ${file.type}`}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              {file.size && (
                <p className="text-[#002B3D]/70 text-sm">
                  Tamanho: {formatFileSize(file.size)}
                </p>
              )}
              
              {file.uploaded_at && (
                <p className="text-[#002B3D]/70 text-sm">
                  Enviado em: {new Date(file.uploaded_at).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              {file.file_url ? (
                <a 
                  href={`http://localhost:8000${file.file_url}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-[#42A5DB] hover:bg-[#1E40AF] text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                >
                  Baixar
                </a>
              ) : (
                <span className="text-[#002B3D]/50 text-sm">Sem link disponível</span>
              )}
            </div>
          </div>
        )) : (
          <div className="flex justify-center items-center w-full col-span-full">
            <div className="text-center py-20">
              <div className="bg-gradient-to-r from-[#002B3D] to-[#FFB627] rounded-3xl p-8 w-32 h-32 mx-auto mb-6 shadow-2xl">
                <svg className="w-16 h-16 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">Nenhum arquivo na plataforma</h3>
              <p className="text-black/60 text-lg">Ainda não há arquivos na plataforma.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}