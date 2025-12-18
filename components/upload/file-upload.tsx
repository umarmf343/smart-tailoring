"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, FileImage, FileIcon } from "lucide-react"

interface FileUploadProps {
  accept?: string
  maxSize?: number // in MB
  multiple?: boolean
  onFilesChange?: (files: File[]) => void
  label?: string
  description?: string
}

export function FileUpload({
  accept = "image/*",
  maxSize = 5,
  multiple = false,
  onFilesChange,
  label = "Upload Files",
  description = "Drag and drop or click to upload",
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)

  function validateFile(file: File): boolean {
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File ${file.name} exceeds maximum size of ${maxSize}MB`)
      return false
    }
    return true
  }

  function handleFiles(newFiles: FileList | null) {
    if (!newFiles) return

    const validFiles: File[] = []
    Array.from(newFiles).forEach((file) => {
      if (validateFile(file)) {
        validFiles.push(file)
      }
    })

    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
    setError("")
  }

  function removeFile(index: number) {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="font-medium mb-1">{label}</p>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <Button type="button" onClick={() => inputRef.current?.click()} variant="outline">
              Select {multiple ? "Files" : "File"}
            </Button>
            <p className="text-xs text-muted-foreground mt-3">Maximum file size: {maxSize}MB</p>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files</p>
          {files.map((file, index) => (
            <Card key={index}>
              <div className="p-3 flex items-center gap-3">
                {file.type.startsWith("image/") ? (
                  <FileImage className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Button type="button" size="sm" variant="ghost" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
