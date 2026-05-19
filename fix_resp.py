import re

def refine_responsiveness():
    with open('style.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # Fix .about-bio-grid not stacking on mobile
    css = css.replace('.bio-grid, .about-bio-grid { grid-template-columns: 1fr; gap: 32px; }', 
                      '.bio-grid, .about-bio-grid { grid-template-columns: 1fr; flex-direction: column; gap: 32px; }')
    
    css = css.replace('.bio-grid, .about-bio-grid { grid-template-columns: 1fr; gap: 40px; }',
                      '.bio-grid, .about-bio-grid { grid-template-columns: 1fr; flex-direction: column; gap: 40px; }')
    
    css = css.replace('.bio-grid, .about-bio-grid { grid-template-columns: 1fr; }',
                      '.bio-grid, .about-bio-grid { grid-template-columns: 1fr; flex-direction: column; }')

    # Fix .container padding inversion (20px on PC, 32px on tablet)
    # The global reset `.container { width: 100%; padding: 0 20px; }` overwrote desktop padding.
    # Let's restore desktop padding for screens > 1024px.
    desktop_container_fix = "\n@media (min-width: 1025px) {\n  .container { padding: 0 40px; }\n}\n"
    
    # Let's also check if there's any other global reset that broke PC.
    # The user said: "it should be proper responsive for pc and phone both and perfectly"
    # Is there a chance the hero h1 size is broken?
    # Original hero h1: font-size: 96px;
    # Appended media queries set it for smaller screens. So PC remains 96px, ULTRAWIDE (1400px+) gets 120px. That's fine.
    
    if '@media (min-width: 1025px)' not in css:
        css += desktop_container_fix
        
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)

if __name__ == "__main__":
    refine_responsiveness()
