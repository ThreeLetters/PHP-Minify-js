/*
MIT License

Copyright (c) 2017 Andrew S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function minify(str) {
    str = str.replace(/\n/g, "").split("");
    var len = str.length;
    var out = [];
    var i = 0;

    function skip(match) {

        var backslash = false;
        out.push(match);

        for (++i; i < len; i++) {
            char = str[i];
            out.push(char);
            if (char === "\\") backslash = true;
            else if (char === match && !backslash) {
                break;
            } else if (backslash) {
                backslash = false;
            }
        }
    }

    function includes(char) {

        var dt = [";", "{", "}", ",", "(", ")", "[", "]", "=", ">", "<", "."];
        return dt.indexOf(char) != -1;
    }

    function includes2(char) {
        var dt = ["=", "{", "(", "}", ")", "]", ">", "<", "!", ".", "$"];

        return dt.indexOf(char) != -1;
    }
    for (; i < len; i++) {
        var char = str[i];

        if (char == "\"") {
            skip("\"");
        } else if (char == "'") {
            skip("'");
        } else if (char == "`") {
            skip("`");
        } else if (char == " ") {

            var d = true;

            for (; i < len; i++) {

                if (includes2(str[i + 1])) {
                    d = false;
                }
                if (str[i + 1] != " ") break;
            }
            if (d) out.push(" ");

        } else if (includes(char)) {
            out.push(char);
            for (; i < len; i++) {
                if (str[i + 1] != " ") break;
            }
        } else {
            out.push(char)
        }

    }
    return out.join("");
}
