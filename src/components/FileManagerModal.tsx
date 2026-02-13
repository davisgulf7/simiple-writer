
import React, { useState, useEffect } from 'react';
import { X, FileText, Trash2, Save, FolderOpen } from 'lucide-react';
import { listFiles, deleteFile, FileMetadata } from '../utils/fileSystem';

interface FileManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (fileId: string) => void;
    onSave: (name: string) => void; // Callback when a new name is entered
    mode: 'open' | 'save';
    initialName?: string;
}

const FileManagerModal: React.FC<FileManagerModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    onSave,
    mode,
    initialName = ''
}) => {
    const [files, setFiles] = useState<FileMetadata[]>([]);
    const [fileName, setFileName] = useState(initialName);
    const [error, setError] = useState('');

    // Load files when modal opens
    useEffect(() => {
        if (isOpen) {
            refreshList();
            if (mode === 'save') {
                setFileName(initialName || `Untitled ${new Date().toLocaleDateString()}`);
            }
        }
    }, [isOpen, mode]);

    const refreshList = () => {
        setFiles(listFiles().sort((a, b) => b.lastModified - a.lastModified));
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this file?')) {
            deleteFile(id);
            refreshList();
        }
    };

    const handleSaveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileName.trim()) {
            setError('Filename cannot be empty');
            return;
        }
        onSave(fileName);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-gray-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {mode === 'open' ? <FolderOpen className="w-5 h-5 text-blue-400" /> : <Save className="w-5 h-5 text-green-400" />}
                        {mode === 'open' ? 'Open File' : 'Save As'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">

                    {/* Save Input */}
                    {mode === 'save' && (
                        <form onSubmit={handleSaveSubmit} className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Filename</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={fileName}
                                    onChange={(e) => { setFileName(e.target.value); setError(''); }}
                                    className="flex-1 px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 placeholder-gray-600"
                                    placeholder="My Awesome Story"
                                    autoFocus
                                />
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
                                    Save
                                </button>
                            </div>
                            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                        </form>
                    )}

                    {/* File List */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {files.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 italic">No saved files found.</div>
                        ) : (
                            files.map((file) => (
                                <div
                                    key={file.id}
                                    onClick={() => onSelect(file.id)}
                                    className="group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 cursor-pointer transition-all"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium truncate max-w-[200px]">{file.name}</h3>
                                            <p className="text-xs text-gray-400">{new Date(file.lastModified).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => handleDelete(e, file.id)}
                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete file"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileManagerModal;
