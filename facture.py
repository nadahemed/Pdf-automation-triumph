import fitz
import matplotlib.pyplot as plt
import time

#Loading documents
doc1=fitz.open("/content/achat2.pdf")
doc2=fitz.open("/content/achat4.pdf")
doc3=fitz.open("/content/achat3.pdf")
doc4=fitz.open("/content/achat5.pdf")
documents=[doc1,doc2,doc3,doc4]

#showing number of pages on each document
for each in documents:
  print("Le nombre de pages de ",each,"est : ",each.page_count)

# Visualisation
document_names = ["achat2.pdf", "achat4.pdf", "achat3.pdf", "achat5.pdf"]
page_counts = [doc.page_count for doc in documents]
plt.figure(figsize=(10, 6))
plt.bar(document_names, page_counts)
plt.xlabel("Document")
plt.ylabel("Nombre de pages")
plt.title("Nombre de pages par document")
plt.show()

#Loading first page of each doc
page1=doc1.load_page(0)
page2=doc2.load_page(0)
page3=doc3.load_page(0)
page4=doc4.load_page(0)
pages=[page1,page2,page3,page4]
for any in pages:
  print(any.get_text())

#Searching our cordinate's rectangles
result1=page1.search_for("Standard")
result2=page2.search_for("Standard")
result3=page3.search_for("Standard")
result4=page4.search_for("Standard")
results=[result1,result2,result3,result4]
for any in results:
  print(any)

#ploting cordinates
def extract_coordinates(results):
    coords = []
    for res_list in results:
        if res_list:
            rect = res_list[0]
            coords.append(((rect.x0 + rect.x1) / 2, (rect.y0 + rect.y1) / 2))
        else:
            coords.append(None)
    return coords

coordinates = extract_coordinates(results)

filtered_coordinates = [coord for coord in coordinates if coord is not None]
filtered_document_names = [document_names[i] for i, coord in enumerate(coordinates) if coord is not None]

x_coords = [coord[0] for coord in filtered_coordinates]
y_coords = [coord[1] for coord in filtered_coordinates]

plt.figure(figsize=(10, 6))
plt.scatter(x_coords, y_coords)

for i, doc_name in enumerate(filtered_document_names):
    plt.annotate(doc_name, (x_coords[i], y_coords[i]), textcoords="offset points", xytext=(0,10), ha='center')

plt.xlabel("X Coordinate")
plt.ylabel("Y Coordinate")
plt.title("Coordinates of 'Standard' in Documents")
plt.grid(True)
plt.show()

#Modifiying  the first doc
page1=doc1.load_page(0)
zonedoc1=fitz.Rect(229.44000244140625, 140.505859375, 272.6297302246094, 151.62164306640625)
xdoc1=zonedoc1.x0
ydoc1=zonedoc1.y0+20
podoc1=fitz.Point(xdoc1,ydoc1)
page1.insert_text(podoc1, " (BIN : XXXXX)", fontsize=9, fontname="helv", color=(0, 0, 0), overlay=True, stroke_opacity=1, fill_opacity=1)

timestamp = int(time.time())
output_filename = f"achat2modified_{timestamp}.pdf"
doc1.save(output_filename)
print(f"Saved modified document as: {output_filename}")

#Modifiying the second one
page2=doc2.load_page(0)
zonedoc2=fitz.Rect(208.0800018310547, 140.505859375, 251.26971435546875, 151.62164306640625)
xdoc2=zonedoc2.x0
ydoc2=zonedoc2.y0+20
podoc2=fitz.Point(xdoc2,ydoc2)
page2.insert_text(podoc2, " (BIN : XXXXX)", fontsize=9, fontname="helv", color=(0, 0, 0), overlay=True, stroke_opacity=1, fill_opacity=1)
timestamp = int(time.time())
output_filename = f"achat4modified_{timestamp}.pdf"
doc2.save(output_filename)
print(f"Saved modified document as: {output_filename}")

#Modifiying the third one
page3=doc3.load_page(0)
zonedoc3=fitz.Rect(221.63998413085938, 140.505859375, 264.8297119140625, 151.62164306640625)
xdoc3=zonedoc3.x0
ydoc3=zonedoc3.y0+20
podoc3=fitz.Point(xdoc3,ydoc3)
page3.insert_text(podoc3, " (BIN : XXXXX)", fontsize=9, fontname="helv", color=(0, 0, 0), overlay=True, stroke_opacity=1, fill_opacity=1)
timestamp = int(time.time())
output_filename = f"achat3modified_{timestamp}.pdf"
doc3.save(output_filename)
print(f"Saved modified document as: {output_filename}")