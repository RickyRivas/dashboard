# Website Builder

How it works:
 1. builder.init():
    1. Load default and custom components
       1. loadControlGroups() - loads draggable components into the dom 
          - components are created by calling Vvveb.Components.extend() with options. also needs to be defined in Vvveb.ComponentsGroup() 
       2. loadBlockGroups() - loads custom components (cards, accordions, etc.)
       3. loadSectionGroups() - same as loadBlockGroups but for sections
    2. Load main iframe
       1. attaches event listeners
    3. DND
    4. Init box - attaches e listeners to actions list within select box

2. Gui.init() - loops all gui elements with [data-vvveb-action] attr and uses that value to connect handlers

3. FileManager.init() - attaches listeners to filemanager elements (I.E. rename page)

4. 


VVVEB Singleton:
