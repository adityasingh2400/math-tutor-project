# parse_pdf.py
##This script:
#Reads the PDF path from the command line (sys.argv[1]).
#Optionally reads JSON config (sys.argv[2]) for advanced Aryn parameters.
#Calls partition_file from aryn_sdk.partition.
#Prints the resulting JSON so Node.js can read it.
# pdfparsing/parse_pdf.py
import sys
import json
from aryn_sdk.partition import partition_file
from aryn_sdk.config import ArynConfig

def main():
    # Arg1 = path to the PDF file
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path given"}))
        sys.exit(1)

    file_path = sys.argv[1]

    # If there's a second arg, treat it as JSON config
    config = {}
    if len(sys.argv) > 2:
        try:
            config = json.loads(sys.argv[2])
        except:
            pass

    # Extract optional config
    chunking_options = config.get("chunking_options", {})
    use_ocr = config.get("use_ocr", True)
    threshold = config.get("threshold", 0.35)
    extract_table_structure = config.get("extract_table_structure", True)

    # If you prefer an explicit key:
    # aryn_api_key = config.get("aryn_api_key", "YOUR-API-KEY")

    try:
        with open(file_path, "rb") as f:
            data = partition_file(
                f,
                # aryn_api_key=aryn_api_key,
                use_ocr=use_ocr,
                threshold=threshold,
                extract_table_structure=extract_table_structure,
                chunking_options=chunking_options
            )
            print(json.dumps(data))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
