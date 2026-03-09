# UX Update Specification
Traditional Chinese Character Recognition Game

This document defines the new UX rules for the application.

The goal of this update is to improve usability for Chinese high school students and simplify the layout for both desktop and mobile devices.

---

# 1 Layout Principles

The game area must always be the most visually dominant section.

Leaderboard and history are secondary information and should appear **below the game area**, not beside it.

New layout order:

Header  
Game Card  
Answer Buttons  
Game Controls  
Feedback Card  
Recent History  
Accuracy Leaderboard

This layout works well for both desktop and mobile.

---

# 2 Header Design

Header should be compact to ensure the game content appears within the first screen on mobile.

Header contains:

Title  
Mode Switch

Title (Chinese):

繁体字挑战

Mode labels:

简繁对应  
一简对多

Avoid English labels like:

single_mapping  
multi_mapping

---

# 3 Player Name

Player name should appear inside the Game Card.

Display rules:

If player_name is empty, display:

匿名

If the name exceeds 8 characters, truncate with ellipsis.

Example:

超级超级长名字 → 超级超级…

---

# 4 Game Flow

The game has three states.

## State 1: Before Start

Show button:

开始游戏

---

## State 2: Answering

User selects answers.

Show button:

重置本题

---

## State 3: After Correct Answer

Once all blanks are correct:

Show button:

下一题

The "Next Question" button should only appear after the user answers correctly.

Users should not skip questions.

---

# 5 Button Text (Chinese UI)

Replace English UI labels.

Old label → New label

Restart → 重置本题  
Next Round → 下一题  
Replay Audio → 重听读音  
Player Name → 玩家名称

---

# 6 History Section

History shows recent attempts.

Columns:

名字  
简体字  
正确率  
日期

Correct rate format:

correct_blank_count / blank_count

Example:

2/2  
1/2  
0/2

---

# 7 Leaderboard Section

Rename leaderboard title to:

正确率排行榜

Columns:

名字  
简体字  
正确率  
Perfect

Perfect column:

Display ⭐ when is_correct = true

Leaderboard sorting rule:

ORDER BY correct_blank_count DESC

---

# 8 Mobile Optimization

The first screen on mobile must include:

Game Card  
Question  
Answer Buttons

Avoid large headers that push the game content below the first screen.

History and Leaderboard appear after scrolling.

---

# 9 Feedback Messages

Use friendly Chinese feedback.

Correct:

太棒了！  
答对了！

Incorrect:

再试一次！

Avoid system-style messages.

---

# 10 UI Philosophy

The UI should feel like a learning game, not a developer dashboard.

Design goals:

clear  
friendly  
minimal  
focused on gameplay

The game interaction must always be the center of the interface.
