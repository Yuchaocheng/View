const array = [
    [
        "text",
        "\n            <div>\n                <ul id=\"list\">\n                "
    ],
    [
        "#",
        "arr"
    ],
    [
        "text",
        "\n                <li>\n                    <p>名称："
    ],
    [
        "name",
        "name"
    ],
    [
        "text",
        "</p>\n                    <p>\n                    "
    ],
    [
        "#",
        "list"
    ],
    [
        "text",
        "\n                    <span>"
    ],
    [
        "name",
        "."
    ],
    [
        "text",
        "</span>\n                    "
    ],
    [
        "/",
        "list"
    ],
    [
        "text",
        "\n                    </p>\n                </li>\n                "
    ],
    [
        "/",
        "arr"
    ],
    [
        "text",
        "\n                </ul>\n            </div>\n            "
    ]
]

const tokens = [];
const sections = [];
for (let index = 0; index < array.length; index++) {
    const item = array[index];
    if (item[0] === "#") {
        sections.push(index)
    } else if (item[0] === "/") {
        const sIndex = sections.pop();
        tokens.push(array.slice(sIndex, index))
    }
}
console.log(tokens, 22);
debugger