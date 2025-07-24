
// DiceRollerApp.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
const rollTypes = ['Normal', 'Advantage', 'Disadvantage'];
const categoryOptions = ['Weapons', 'Items', 'Attributes', 'Character Type', 'Custom', 'Character', 'NPCs', 'Monster Mods', 'Roll Type'];

const generateDefaultRows = () => {
  let rows = [];
  for (let i = 0; i < 20; i++) {
    rows.push({
      id: i,
      category: 'Custom',
      dice: 'd20',
      modifier: 0,
      rollType: 'Normal'
    });
  }
  return rows;
};

const App = () => {
  const [mode, setMode] = useState<'player' | 'dm' | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const rollDice = (row: any, index: number) => {
    const sides = parseInt(row.dice.slice(1));
    let roll1 = Math.ceil(Math.random() * sides);
    let roll2 = Math.ceil(Math.random() * sides);
    let final = roll1;

    if (row.rollType === 'Advantage') final = Math.max(roll1, roll2);
    if (row.rollType === 'Disadvantage') final = Math.min(roll1, roll2);

    final += row.modifier;
    const msg = `${row.category}: ${row.dice} ${row.rollType} +${row.modifier} → ${final}`;
    setResult(msg);
    setLog([msg, ...log]);
  };

  if (!mode) {
    return (
      <div className="min-h-screen bg-[#1c0f13] text-white flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold text-purple-200">Choose Your Role</h1>
        <Button onClick={() => {
          setMode('player');
          setRows(generateDefaultRows());
        }} className="bg-red-800 text-white">Player</Button>
        <Button onClick={() => {
          setMode('dm');
          setRows(generateDefaultRows());
        }} className="bg-purple-900 text-white">Dungeon Master</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c0f13] text-white p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-purple-300">🎲 {mode === 'player' ? 'Player Setup' : 'Dungeon Master Setup'}</h1>
        <Button onClick={() => setMode(null)} className="bg-black text-white">Back</Button>
      </div>

      <div className="mt-6 space-y-1">
        {rows.map((row, index) => (
          <div key={index} className="flex flex-wrap md:flex-nowrap items-center gap-2 bg-[#2a1b2e] border border-purple-400 p-1 rounded text-sm">
            <select
              value={row.category}
              onChange={(e) => {
                const newRows = [...rows];
                newRows[index].category = e.target.value;
                setRows(newRows);
              }}
              className="bg-black text-white p-1 rounded border border-purple-400">
              {categoryOptions.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
            </select>
            <select
              value={row.dice}
              onChange={(e) => {
                const newRows = [...rows];
                newRows[index].dice = e.target.value;
                setRows(newRows);
              }}
              className="bg-black text-white p-1 rounded border border-purple-400">
              {diceTypes.map((die, idx) => <option key={idx} value={die}>{die}</option>)}
            </select>
            <input
              type="number"
              value={row.modifier}
              onChange={(e) => {
                const newRows = [...rows];
                newRows[index].modifier = parseInt(e.target.value) || 0;
                setRows(newRows);
              }}
              className="w-14 bg-black text-white p-1 rounded border border-purple-400"
            />
            <select
              value={row.rollType}
              onChange={(e) => {
                const newRows = [...rows];
                newRows[index].rollType = e.target.value;
                setRows(newRows);
              }}
              className="bg-black text-white p-1 rounded border border-purple-400">
              {rollTypes.map((r, idx) => <option key={idx} value={r}>{r}</option>)}
            </select>
            <Button onClick={() => rollDice(row, index)} className="bg-red-600 text-white px-2 py-1">
              Roll
            </Button>
          </div>
        ))}
      </div>

      {result && (
        <Card className="bg-black text-white mt-4 p-4 border border-purple-400">
          <h2 className="text-lg font-bold">Result:</h2>
          <p>{result}</p>
          <Button className="mt-2 bg-purple-900" onClick={() => setResult(null)}>Dismiss</Button>
        </Card>
      )}

      <div className="mt-6 border-t border-purple-800 pt-4">
        <h3 className="text-purple-400 mb-2">🧾 Roll Log (Swipe Right on Mobile)</h3>
        <div className="overflow-x-auto space-y-1">
          {log.slice(0, 20).map((entry, i) => <div key={i} className="text-sm">{entry}</div>)}
        </div>
      </div>
    </div>
  );
};

export default App;
