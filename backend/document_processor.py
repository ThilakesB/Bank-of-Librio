import os
import json
import re
from typing import List, Dict, Any, Tuple
import pandas as pd

class DocumentProcessor:
    def __init__(self, chunk_size: int = 600, chunk_overlap: int = 80):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def process_file(self, file_path: str, filename: str) -> Tuple[List[str], List[Dict[str, Any]]]:
        """
        Process a file based on its extension and return chunk texts and metadatas.
        """
        ext = os.path.splitext(filename)[1].lower()

        if ext in ['.csv', '.xlsx', '.xls']:
            return self._process_tabular(file_path, filename, ext)
        elif ext == '.pdf':
            return self._process_pdf(file_path, filename)
        elif ext in ['.docx', '.doc']:
            return self._process_docx(file_path, filename)
        elif ext in ['.json']:
            return self._process_json(file_path, filename)
        elif ext in ['.html', '.htm']:
            return self._process_html(file_path, filename)
        elif ext in ['.txt', '.md']:
            return self._process_text(file_path, filename, file_type=ext[1:].upper())
        else:
            # Fallback to plain text
            return self._process_text(file_path, filename, file_type="TXT")

    def _process_tabular(self, file_path: str, filename: str, ext: str) -> Tuple[List[str], List[Dict[str, Any]]]:
        """Convert tabular rows into structured key-value text blocks with sheet and row metadata."""
        chunks = []
        metadatas = []

        try:
            if ext == '.csv':
                sheets_dict = {"Sheet1": pd.read_csv(file_path)}
            else:
                sheets_dict = pd.read_excel(file_path, sheet_name=None)
        except Exception as e:
            print(f"Error reading tabular file {filename}: {e}")
            return [], []

        for sheet_name, df in sheets_dict.items():
            if df.empty:
                continue
            
            # Fill NA values cleanly
            df = df.fillna("N/A")
            
            for row_idx, row in df.iterrows():
                row_num = row_idx + 1
                row_str_list = []
                for col_name in df.columns:
                    val = str(row[col_name]).strip()
                    row_str_list.append(f"{col_name}: {val}")
                
                chunk_text = f"Source Table: {filename} | Sheet: {sheet_name} | Record #{row_num}\n" + "\n".join(row_str_list)
                
                chunks.append(chunk_text)
                metadatas.append({
                    "filename": filename,
                    "sheet": str(sheet_name),
                    "row_number": row_num,
                    "file_type": ext[1:].upper(),
                    "source": f"{filename} (Sheet: {sheet_name}, Row: {row_num})"
                })

        return chunks, metadatas

    def _process_pdf(self, file_path: str, filename: str) -> Tuple[List[str], List[Dict[str, Any]]]:
        """Extract pages & paragraphs from PDF."""
        chunks = []
        metadatas = []
        try:
            from pypdf import PdfReader
            reader = PdfReader(file_path)
            for page_num, page in enumerate(reader.pages, start=1):
                text = page.extract_text() or ""
                page_chunks = self._chunk_text_string(text)
                for chunk_idx, text_chunk in enumerate(page_chunks):
                    chunks.append(text_chunk)
                    metadatas.append({
                        "filename": filename,
                        "page_number": page_num,
                        "chunk_index": chunk_idx + 1,
                        "file_type": "PDF",
                        "source": f"{filename} (Page {page_num})"
                    })
        except Exception as e:
            print(f"Error extracting PDF {filename}: {e}")
            # Fallback plain text read
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            return self._chunk_generic_text(content, filename, "PDF")

        return chunks, metadatas

    def _process_docx(self, file_path: str, filename: str) -> Tuple[List[str], List[Dict[str, Any]]]:
        """Extract headings & paragraphs from DOCX."""
        chunks = []
        metadatas = []
        try:
            import docx
            doc = docx.Document(file_path)
            full_text = []
            for p in doc.paragraphs:
                if p.text.strip():
                    full_text.append(p.text.strip())
            combined = "\n\n".join(full_text)
            return self._chunk_generic_text(combined, filename, "DOCX")
        except Exception as e:
            print(f"Error processing DOCX {filename}: {e}")
            return [], []

    def _process_json(self, file_path: str, filename: str) -> Tuple[List[str], List[Dict[str, Any]]]:
        """Process JSON records or generic structure."""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            if isinstance(data, list):
                chunks = []
                metadatas = []
                for idx, item in enumerate(data, start=1):
                    item_str = json.dumps(item, indent=2)
                    chunks.append(f"JSON Record #{idx}:\n{item_str}")
                    metadatas.append({
                        "filename": filename,
                        "record_number": idx,
                        "file_type": "JSON",
                        "source": f"{filename} (Record #{idx})"
                    })
                return chunks, metadatas
            else:
                formatted = json.dumps(data, indent=2)
                return self._chunk_generic_text(formatted, filename, "JSON")
        except Exception as e:
            print(f"Error reading JSON {filename}: {e}")
            return [], []

    def _process_html(self, file_path: str, filename: str) -> Tuple[List[str], List[Dict[str, Any]]]:
        """Extract text content from HTML."""
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                html_content = f.read()
            # Strip tags using regex
            clean_text = re.sub(r'<style.*?>.*?</style>', '', html_content, flags=re.DOTALL)
            clean_text = re.sub(r'<script.*?>.*?</script>', '', clean_text, flags=re.DOTALL)
            clean_text = re.sub(r'<[^>]+>', ' ', clean_text)
            clean_text = re.sub(r'\s+', ' ', clean_text).strip()
            return self._chunk_generic_text(clean_text, filename, "HTML")
        except Exception as e:
            print(f"Error reading HTML {filename}: {e}")
            return [], []

    def _process_text(self, file_path: str, filename: str, file_type: str = "TXT") -> Tuple[List[str], List[Dict[str, Any]]]:
        """Read text/markdown file."""
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
            return self._chunk_generic_text(text, filename, file_type)
        except Exception as e:
            print(f"Error reading text file {filename}: {e}")
            return [], []

    def _chunk_generic_text(self, text: str, filename: str, file_type: str) -> Tuple[List[str], List[Dict[str, Any]]]:
        chunks_str = self._chunk_text_string(text, header_prefix=f"Document: {filename} | Type: {file_type}\n")
        chunks = []
        metadatas = []
        for idx, c in enumerate(chunks_str, start=1):
            chunks.append(c)
            metadatas.append({
                "filename": filename,
                "chunk_index": idx,
                "file_type": file_type,
                "source": f"{filename} (Chunk #{idx})"
            })
        return chunks, metadatas

    def _chunk_text_string(self, text: str, header_prefix: str = "") -> List[str]:
        """
        Smart recursive sentence & paragraph aware chunking.
        Prevents breaking words, numbers, or sentences mid-way.
        """
        text = text.strip()
        if not text:
            return []

        # If text fits inside chunk size
        if len(text) <= self.chunk_size:
            return [f"{header_prefix}{text}" if header_prefix else text]

        # Recursive separators: paragraphs, lines, sentences, clauses
        separators = ["\n\n", "\n", ". ", "; ", "? ", "! ", " "]
        
        def split_text_by_separators(txt: str, sep_idx: int = 0) -> List[str]:
            if sep_idx >= len(separators) or len(txt) <= self.chunk_size:
                return [txt] if txt.strip() else []

            sep = separators[sep_idx]
            parts = txt.split(sep)
            
            result_chunks = []
            current_chunk = []
            current_length = 0

            for part in parts:
                part_str = part + (sep if sep != " " else " ")
                part_len = len(part_str)

                if current_length + part_len > self.chunk_size:
                    if current_chunk:
                        chunk_text = "".join(current_chunk).strip()
                        if chunk_text:
                            result_chunks.append(chunk_text)
                        current_chunk = []
                        current_length = 0

                    if part_len > self.chunk_size:
                        # Sub-split long parts using next separator
                        sub_parts = split_text_by_separators(part, sep_idx + 1)
                        result_chunks.extend(sub_parts)
                    else:
                        current_chunk.append(part_str)
                        current_length += part_len
                else:
                    current_chunk.append(part_str)
                    current_length += part_len

            if current_chunk:
                final_text = "".join(current_chunk).strip()
                if final_text:
                    result_chunks.append(final_text)

            return result_chunks

        raw_chunks = split_text_by_separators(text, 0)
        
        # Add overlap and optional header prefix
        final_chunks = []
        for i, chunk in enumerate(raw_chunks):
            chunk_with_header = f"{header_prefix}{chunk}" if header_prefix else chunk
            final_chunks.append(chunk_with_header)

        return final_chunks

