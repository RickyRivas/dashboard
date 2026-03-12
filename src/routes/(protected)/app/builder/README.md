# Website Builder

How it works:
 1. Onmount:
    1. Load default and custom components
       1. loadControlGroups() - loads draggable components into the dom 
          - components are created by calling Vvveb.Components.extend() with options. also needs to be defined in Vvveb.ComponentsGroup() 
       2. loadBlockGroups() - loads custom components (cards, accordions, etc.)
       3. loadSectionGroups() - same as loadBlockGroups but for sections
    2. Load main iframe
       1. attaches event listeners



VVVEB Singleton:
