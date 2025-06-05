import antlr4 from 'antlr4';
import fs from 'fs';
import MyLanguageLexer from './51337/parser/MyLanguageLexer.js';
import MyLanguageParser from './51337/parser/MyLanguageParser.js';
import Interpreter from './51337/parser/Interpreter.js';

// Lee el archivo de entrada
const input = fs.readFileSync('input.txt', 'utf8');
const chars = new antlr4.InputStream(input);
const lexer = new MyLanguageLexer(chars);
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new MyLanguageParser(tokens);

parser.buildParseTrees = true;

// Manejo de errores personalizado
parser.removeErrorListeners();
parser.addErrorListener({
    syntaxError: function(recognizer, offendingSymbol, line, column, msg) {
        console.error(`Error de sintaxis en línea ${line}, columna ${column}: ${msg}`);
        process.exit(1);
    }
});

const tree = parser.programa();

// Mostrar tabla de tokens y lexemas alineada
tokens.fill();
console.log('\nTabla de tokens y lexemas:');
console.log('┌─────────────────────┬─────────────────────┐');
console.log('│ Token               │ Lexema              │');
console.log('├─────────────────────┼─────────────────────┤');
tokens.tokens.forEach(token => {
    if (token.type > 0 && token.type < parser.symbolicNames.length) {
        const tokenName = (parser.symbolicNames[token.type] || 'LITERAL').padEnd(19);
        const lexema = (`"${token.text}"`).padEnd(19);
        console.log(`│ ${tokenName} │ ${lexema} │`);
    }
});
console.log('└─────────────────────┴─────────────────────┘');
// Función para imprimir el árbol de forma jerárquica
function printParseTree(node, parser, indent = '') {
    if (!node) return;
    // Si es un token hoja
    if (node.children == null) {
        console.log(indent + node.getText());
        return;
    }
    // Nombre de la regla
    const ruleName = parser.ruleNames[node.ruleIndex];
    console.log(indent + ruleName);
    node.children.forEach(child => printParseTree(child, parser, indent + '  '));
}

// Mostrar árbol sintáctico de forma jerárquica
console.log('\nÁrbol de análisis sintáctico :');
printParseTree(tree, parser);

// Interpretar y traducir a JavaScript
const interpreter = new Interpreter();
const jsCode = interpreter.visit(tree);

console.log('\nCódigo JavaScript generado:');
console.log(jsCode);


console.log('\nEntrada válida.');