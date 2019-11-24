var ColorChosen = '#000000';
var InputColorInput = document.querySelector("input[name=ColorInput]");
var PanelColorMixed =  document.querySelector("#ColorMixedPanel");
var ColorMixedName =  document.querySelector("#ColorMixedName");
var PanelColors =  document.querySelector("#ColorsPanel");
var ButtonAdd = document.querySelector("button[name=Add]");
var Colors = [];

class Color {
    constructor (value)
    {
        this._hex = null;
        this._r = 0;
        this._g = 0;
        this._b = 0;

        if (!Array.isArray(value) && /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test(value)) {
            var matches = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            value = [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3])];
        }
        
        if (Array.isArray(value)){
            this._r = value[0];
            this._g = value[1];
            this._b = value[2];
            this.RGBToHex();
            return;
        }

        if (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.test(value)) {
            this._hex = value;
            this.hexToRGB();
        }

    }
    get hex() {return this._hex; }
    set hex(hex) {
        if (this._hex == hex) return;
        this._hex = hex;
        this.hexToRGB();
    }
    
    get r() {return this._r; }
    set r(r) {
        if (this._r == parseInt(r)) return;
        this._r = parseInt(r);
        this.RGBToHex();
    }
    get g() {return this._g; }
    set g(g) {
        if (this._g == parseInt(g)) return;
        this._g = parseInt(g);
        this.RGBToHex();
    }
    get b() {return this._b; }
    set b(b) {
        if (this._b == parseInt(b)) return;
        this._b = parseInt(b);
        this.RGBToHex();
    }

    RGBToHex () {
        var r = this._r,g = this._g, b = this._b;
        this._hex = "#"
            + r.toString(16).padStart(2, "0")
            + g.toString(16).padStart(2, "0")
            + b.toString(16).padStart(2, "0");

    }

    hexToRGB() {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        this._hex = this._hex.replace(shorthandRegex, function(m, r, g, b) {
            this._hex = r + r + g + g + b + b;
        });
      
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this._hex);
        this._r = parseInt(result[1], 16);
        this._g = parseInt(result[2], 16);
        this._b = parseInt(result[3], 16);
    }
}

function ColorIsChosen(event)
{
    ColorChosen = event.target.value;
    ColorIsAdded();
}

function ColorIsAdded()
{
    var NewColor = new Color(ColorChosen);
    var IsNew = true;

    Colors.forEach(color => {
        if (color.hex == NewColor.hex) {
            IsNew = false;
        }
    });

    // don't add an existing color
    if (!IsNew) return;

    Colors.push(NewColor);
    MixColor();
}

function MixColor()
{
    PanelColors.innerHTML = '';
    var MixedColor = new Color([0,0,0]);
    Colors.forEach(color => {
        MixedColor.r += color.r;
        MixedColor.g += color.g;
        MixedColor.b += color.b;
        PanelColors.innerHTML += '<div class="ColorPanel left" style="background-color: '+color.hex+';"></div>';
        console.log(color);
    });
    if (Colors.length > 0) {
        MixedColor.r = MixedColor.r / Colors.length;
        MixedColor.g = MixedColor.g / Colors.length;
        MixedColor.b = MixedColor.b / Colors.length;
    }
    PanelColorMixed.style.backgroundColor = MixedColor.hex;
    ColorMixedName.innerText = MixedColor.hex;
}

function ColorIsRemoved(event)
{
    var target = event.target;
    
    if (!target.classList.contains("ColorPanel")) {
        return;
    }

    var RemovedColor = new Color(event.target.style.backgroundColor);
    Colors = Colors.filter(function(value, index, arr) {
        return value.hex != RemovedColor.hex;
    });

    MixColor();
}

InputColorInput.addEventListener("change", ColorIsChosen, false);
PanelColors.addEventListener("click", ColorIsRemoved, false);
