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

/**
* Minify PHP code
*
* @param {String} str - PHP code to minify
* @param {Object} options - Extra options (optional)
*
* Options available:
* - varReplace - Replace variables (Default: true)
* - extremeMinify - Remove all uneccessary whitespace (Default true)
* - removeLine - Remove line breaks (Default: true)
*/

function minify(str,options) {
    if (!options) options = {};
    str = removeComments(str);
    var varReplace = options.varReplace === undefined ? true : options.varReplace;
    var extreme = options.extremeMinify === undefined ? true : options.extremeMinify;
    var removeLine = options.removeLine === undefined ? true : options.removeLine;
    
    if (removeLine) {
        str = str.replace(/\n/g, "").replace(/\t/g,"").split("");
    } else {
       str = str.split("");
    }
    var len = str.length;
    var out = [];
    var i = 0;
    var varIndex = [0];
    var varChars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    var varLen = varChars.length;
    var varMap = {};

    function getNextVar() {

        var str = "";
        var j = 0;
        while (true) {
            if (!varIndex[j]) varIndex[j] = 0;
            varIndex[j]++;

            if (varIndex[j] > varLen) {
                varIndex[j] = 1;
            } else {
                break;
            }
            j++;
        }

        for (var i = 0; i < varIndex.length; i++) {
            str += varChars[varIndex[i] - 1];
        }

        return str;
    }

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
        if (extreme) dt.push("&","|","+","-","*","/");
        return dt.indexOf(char) != -1;
    }

    function includes2(char) {
        var dt = ["=", "{", "(", "}", ")", "]", ">", "<", "!", "."];
        if (extreme) dt.push("$","&","|","+","-","*","/");
        return dt.indexOf(char) != -1;
    }

    function includes3(char) {
        var dt = ["_", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

        return dt.indexOf(char.toLowerCase()) != -1;
    }

    for (; i < len; i++) {
        var char = str[i];

        if (char == "\"") {
            skip("\"");
        } else if (char == "'") {
            skip("'");
        } else if (char == "`") {
            skip("`");
        } else if (varReplace && char == "$") {

            var v = "";
            for (; i < len; i++) {

                if (!includes3(str[i + 1])) break;
                v += str[i + 1];
            }
            if (varMap[v]) {
                out.push(varMap[v]);
            } else if (v != "this") {
                var found = false;
                for (var j = i; j < len; j++) {
                    if (str[j + 1] == "=" || str[j + 1] == "," || str[j + 1] == ")") {
                        found = true;
                        break;
                    } else if (str[j + 1] != " ") {
                        break;
                    }
                }
                if (found) {
                    for (var j = i - v.length - 1; j > 0; j--) {
                        if (str[j] == "c" || str[j] == "e" || str[j] == "l" || str[j] == "d") {
                            found = false;
                            break;
                        } else if (str[j] != " ") {
                            break;
                        }
                    }
                }
                if (found) {
                    varMap[v] = "$" + getNextVar();
                    // console.log(v, varMap[v])
                    out.push(varMap[v]);
                } else {
                    out.push("$" + v);
                }
            } else {
                out.push("$" + v);
            }
            //console.log(v);

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
function removeComments(str) {

    str = str.split("");
    var len = str.length;
    var out = [];
    var i = 0

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
    for (; i < len; i++) {
        var char = str[i];

        if (char == "\"") {
            skip("\"");
        } else if (char == "'") {
            skip("'");
        } else if (char == "/") {
            i++
            if (str[i] == "/") {
                for (++i; i < len; i++) {
                    var c = str[i];
                    if (c == "\n") {
                        out.push("\n")
                        break;
                    }
                }

            } else if (str[i] == "*") {

                var star = false;
                for (++i; i < len; i++) {
                    var c = str[i];
                    if (c == "*") {
                        star = true;
                    } else
                    if (c == "/" && star) {
                        break;
                    } else if (star) {
                        star = false;
                    }
                }
            }
        } else {
            out.push(char)
        }

    }
    return out.join('').replace(/\n\s*\n/g, "\n");
}
