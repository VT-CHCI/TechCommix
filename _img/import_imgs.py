import os
import sys

rootdir = sys.argv[1]

outfileName = "stock_panels.json"
fileArray = []

for root, subFolders, files in os.walk(rootdir):
    for folder in subFolders:
        print "%s has subdirectory %s" % (root, folder)

    for filename in files:
        if filename[0] != '.':
          filePath = os.path.join(root, filename)
          fileArray.append('"' + filePath + '"')

with open( outfileName, 'w' ) as folderOut:
  folderOut.write('[\n  ' + ',\n  '.join(fileArray) + '\n]')
