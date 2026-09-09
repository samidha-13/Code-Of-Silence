# CODE OF SILENCE — HOW TO PLAY

## 1. Run the Game

Open the project folder in the terminal and run:

```bash
npm install
```

Then start the game:

```bash
npm run dev
```

Open the local URL provided by the terminal.

---

## 2. Start the Investigation

On the game screen, click:

> **PATH IS HIDDEN**

The following sentence will appear:

> **Only the right name reveals the way forward. Which room will you try?**

The room names will appear in a **shuffled order**, but the correct investigation sequence is always:

Files missing. Secrets exposed →  Archive Room
Chemicals. Logs erased → Research Lab
Data stolen. Trail vanished → Server Room
Books scattered. Desk forced open → Dr. Verma's Offic

Enter the names **exactly as written above** and in this sequence to unlock the rooms.

---

## 3. Dr. Verma's Office

After the rooms are unlocked, enter **Dr. Verma's Office**.

First, click the **PC** and use the **Zoom button at the top-right corner** of the screen.

Use the following passcode:

```text
112305
```

Investigate the files available on the PC and proceed to the Research Lab.

---

## 4. Research Lab

Enter the Research Lab using:

```text
100110
```

Open the **Research Lab Terminal**.

First type:

```bash
cheatsheet
```

Then execute the following commands:

### Compile the executable

```bash
gcc buggy.code.c
```

### Run the executable

```bash
./buggy.code
```

This reveals the **motive**.

### View the source code

```bash
nano buggy.code.c
```

### View the encoded file

```bash
cat encoded.base64.txt
```

### Decode the Base64 file

```bash
cat encoded.base64.txt | base64 --decode
```

The decoded output gives:

```text
7
```

Keep this number. It is required later.

---

## 5. Archive Room

Enter the Archive Room using:

```text
452011
```

Solve the **Decode the Investigation Sequence** puzzle.

The clues and their correct rooms are:

* **Books scattered. Desk forced open.** → `Dr. Verma's Office`
* **Chemicals. Logs erased.** → `Research Lab`
* **Files missing. Secrets exposed.** → `Personal Archive Room`
* **Data stolen. Trail vanished.** → `Server Room`

The correct sequence is:

1. `Dr. Verma's Office`
2. `Research Lab`
3. `Personal Archive Room`
4. `Server Room`

For the clue:

> **Files missing. Secrets exposed.**

enter:

```text
Personal Archive Room
```

Complete the puzzle and proceed to the Server Room.

---

## 6. Server Room

Enter the Server Room using:

```text
731104
```

Open the **Server Rack Boot Sequence Reorder** puzzle.

Click:

> **SYSTEM CALIBRATE**

Make the following connections:

```text
1 → 3
3 → 1
2 → 2
4 → 4
```

After completing the puzzle, click **Back to Map**.

---

## 7. Return to the Map

On the map, click:

> **X**

Enter the number obtained from the Research Lab:

```text
7
```

This reveals the next required clue.

---

## 8. Final Code

The game requires you to investigate/open a maximum of **8 files/puzzle steps** in total to collect the clues needed for the final combination.

Once all required clues have been obtained, enter the final 4-digit code:

```text
8745
```

This completes the investigation.

# END OF CODE OF SILENCE
