from pathlib import Path
import re
import sys

def convert(contents):
  dollar_re = r"\$(\w)"
  function_re = r"(public|private|static) function"
  arrow_re = r"->"
  php_re = r"<\?php"
  php2_re = r"\?>"
  exception_re = r"throw new Exception>"
  foreach_re = r"foreach\((\w+)(\.getIterator\(\))? as (\w+) => (\w+)\)"
  contents, _ = re.subn(dollar_re, lambda match: match.group(1), contents)
  contents, _ = re.subn(function_re, lambda match: match.group(1), contents)
  contents, _ = re.subn(arrow_re, lambda match: ".", contents)
  contents, _ = re.subn(php_re, lambda match: "", contents)
  contents, _ = re.subn(php2_re, lambda match: "", contents)
  contents, _ = re.subn(exception_re, lambda match: "throw new Error", contents)
  contents, _ = re.subn(foreach_re, lambda match: "for (const [" + match.group(3) + ", " + match.group(4) + "] of " + match.group(1) + ")", contents)
  #print(contents)

  return contents



if __name__ == "__main__":
  if len(sys.argv) <2:
      sys.exit()
  file = Path(sys.argv[1])
  if (not file.exists()):
      print(f"${file} does not exist!!")
      sys.exit()
      
  new_file = file.with_suffix(".ts")
  if new_file.exists():
    file = new_file
  new_file.write_text(convert(file.read_text()))
