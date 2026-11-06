# Design Document: To-Do List Life Dashboard

## Overview

The To-Do List Life Dashboard is a single-page web application that combines time management (25-minute Pomodoro timer), task tracking (To-Do List), quick access to favorite websites (Quick Links), and theme customization (Light/Dark mode) in a single user interface. All features are implemented using HTML, CSS, and Vanilla JavaScript with data persistence through the browser's Local Storage API.

The application follows a modular architecture with clear separation of concerns between data management, UI rendering, and business logic. It provides a personalized greeting, time display, and persistent data storage across user sessions.

## Architecture

### Folder Structure

```
d:\CodingCamp-2November26-khansa\
├── index.html                    # Main HTML file
├── styles/
│   └── style.css                 # Main stylesheet
├── scripts/
│   ├── app.js                    # Application entry point
│   ├── greeting.js               # Greeting and time display logic
│   ├── timer.js                  # Focus timer logic
│   ├── todo.js                   # To-Do list management
│   ├── quicklinks.js             # Quick links management
│   ├── theme.js                  # Theme management
│   └── storage.js                # Local Storage utility
└── assets/
    └── audio/                    # Sound effects (optional)
```

### Component Breakdown

```
┌─────────────────────────────────────────────────────────┐
│                      Dashboard Header                   │
│  ┌─────────────────┐  ┌───────────┐  ┌──────────────┐  │
│  │   Greeting      │  │   Timer   │  │  Mode Toggle │  │
│  │   (Name/Time)   │  │           │  │              │  │
│  └─────────────────┘  └───────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
│                     Main Content Area                   │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │   To-Do List     │  │  Quick Links     │            │
│  │                  │  │                  │            │
│  └──────────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

### Technical Stack

- **HTML5**: Semantic markup for structure
- **CSS3**: Modern CSS with CSS Variables for theming
- **Vanilla JavaScript (ES6+)**: Modules and class-based architecture
- **Local Storage API**: Data persistence
- **Web Audio API** (optional): Timer completion sound

### Data Flow

```
User Interaction → Event Handler → Business Logic → Storage → UI Update
```

All data changes flow through a centralized storage layer that persists to Local Storage and triggers UI updates via event propagation.

## Components and Interfaces

### Module: greeting.js

**Purpose**: Displays personalized greeting and current time/date

**Functions**:
- `getGreeting()` - Returns time-appropriate greeting
- `updateGreetingDisplay()` - Updates the DOM with greeting and time
- `getTimeDisplay()` - Formats current time as HH:MM
- `getDateDisplay()` - Formats current date as Day, Month DD, YYYY

**State**:
- `userName` - User's custom name (string)
- `updateInterval` - Interval ID for time updates (number)

### Module: timer.js

**Purpose**: Manages 25-minute Pomodoro timer

**Functions**:
- `startTimer()` - Begin countdown from current duration
- `stopTimer()` - Pause the timer, preserving remaining time
- `resetTimer()` - Reset to full duration and stop
- `setDuration(minutes)` - Change timer duration
- `formatTime(seconds)` - Format seconds as MM:SS
- `playCompletionSound()` - Play completion sound (if available)

**State**:
- `duration` - Timer duration in seconds (default: 1500)
- `timeRemaining` - Current time remaining in seconds
- `isRunning` - Timer state (boolean)
- `timerId` - Interval ID for countdown (number)

**Configuration**:
```javascript
{
  durations: [5, 10, 15, 20, 25], // Available duration options
  defaultDuration: 25
}
```

### Module: todo.js

**Purpose**: Manages To-Do list operations

**Functions**:
- `addTask(text)` - Add a new task
- `toggleTask(id)` - Mark task as completed/not completed
- `editTask(id, newText)` - Edit task text
- `deleteTask(id)` - Remove a task
- `checkDuplicate(text)` - Check if task text already exists
- `loadTasks()` - Load tasks from storage
- `saveTasks()` - Save tasks to storage

**State**:
- `tasks` - Array of task objects

**Data Structure**:
```javascript
{
  id: string,           // Unique identifier (UUID)
  text: string,         // Task description
  completed: boolean,   // Completion status
  createdAt: number     // Timestamp
}
```

### Module: quicklinks.js

**Purpose**: Manages quick link bookmarks

**Functions**:
- `addLink(url, label)` - Add a new quick link
- `deleteLink(id)` - Remove a quick link
- `loadLinks()` - Load links from storage
- `saveLinks()` - Save links to storage

**State**:
- `links` - Array of link objects

**Data Structure**:
```javascript
{
  id: string,   // Unique identifier (UUID)
  url: string,  // Website URL
  label: string // Display label
}
```

### Module: theme.js

**Purpose**: Manages Light/Dark theme switching

**Functions**:
- `toggleTheme()` - Switch between light and dark themes
- `setTheme(themeName)` - Set specific theme
- `loadTheme()` - Load saved theme preference
- `applyTheme(themeName)` - Apply theme CSS variables

**State**:
- `currentTheme` - Active theme name ('light' or 'dark')

**CSS Variables**:
```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --card-bg: #f5f5f5;
  --border-color: #dddddd;
  --accent-color: #4a90d9;
}

[data-theme="dark"] {
  --bg-color: #1a1a2e;
  --text-color: #e0e0e0;
  --card-bg: #16213e;
  --border-color: #0f3460;
  --accent-color: #533483;
}
```

### Module: storage.js

**Purpose**: Centralized Local Storage access

**Functions**:
- `save(key, data)` - Save data to Local Storage
- `load(key)` - Load data from Local Storage
- `remove(key)` - Remove item from Local Storage
- `saveWithFallback(key, data)` - Save with error handling
- `loadWithFallback(key, defaultValue)` - Load with fallback

**Keys**:
- `greeting_name` - User's custom name
- `timer_settings` - Timer configuration
- `todo_tasks` - Task list
- `quick_links` - Quick link bookmarks
- `current_theme` - Theme preference

## Data Models

### Local Storage Structure

```javascript
{
  "greeting_name": "User",                    // String
  "timer_settings": {                         // Object
    "duration": 1500,
    "timeRemaining": 1500,
    "isRunning": false
  },
  "todo_tasks": [                             // Array of Objects
    {
      "id": "uuid-string-1",
      "text": "Sample task",
      "completed": false,
      "createdAt": 1234567890123
    }
  ],
  "quick_links": [                            // Array of Objects
    {
      "id": "uuid-string-2",
      "url": "https://example.com",
      "label": "Example"
    }
  ],
  "current_theme": "light"                    // String
}
```

### Data Validation Rules

1. **Task Text**: 
   - Must be non-empty string
   - Trimmed of whitespace
   - Case-insensitive duplicate check

2. **Quick Link URL**:
   - Must be valid URL format
   - Must include protocol (http:// or https://)
   - Trimmed of whitespace

3. **Quick Link Label**:
   - Must be non-empty string
   - Trimmed of whitespace

4. **User Name**:
   - Must be non-empty string
   - Trimmed of whitespace

## UI Layout

### Header Section

```
┌────────────────────────────────────────────────────────────────────┐
│ [ greeting: "Good morning, John!" ]  [ timer ]  [ mode toggle ]    │
└────────────────────────────────────────────────────────────────────┘
```

**Greeting Area**:
- Displays personalized greeting (e.g., "Good morning, John!")
- Shows current time in HH:MM format
- Shows current date
- Click to view/edit name in settings modal

**Timer Area**:
- Displays remaining time in MM:SS format
- Shows "25:00" when idle
- Shows "Paused" when stopped
- Duration selector dropdown (5, 10, 15, 20, 25 minutes)
- Control buttons: Start, Stop, Reset

**Mode Toggle**:
- Sun icon for Light mode
- Moon icon for Dark mode
- Positioned in top-right corner

### Main Content Area

```
┌────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────┐  ┌──────────────────────┐               │
│  │  To-Do List          │  │  Quick Links         │               │
│  │                      │  │                      │               │
│  │  [Input + Add]       │  │  [No links added yet]│              │
│  │                      │  │                      │               │
│  │  Tasks:              │  │  Links:              │               │
│  │  ☐ Task 1 [Edit][✗]  │  │  ☑ Link 1 [✗]        │               │
│  │  ☑ Task 2 [Edit][✗]  │  │                      │               │
│  │  ☐ Task 3 [Edit][✗]  │  │                      │               │
│  │                      │  │                      │               │
│  └──────────────────────┘  └──────────────────────┘               │
└────────────────────────────────────────────────────────────────────┘
```

**To-Do List Panel**:
- Input field for new tasks
- Add button
- Task list with checkboxes for completion
- Edit button for each task
- Delete button (X icon) for each task
- Duplicate prevention error message

**Quick Links Panel**:
- Input fields for URL and label
- Add button
- Link buttons (opens URL in new tab)
- Delete button for each link
- Empty state message when no links added

## Algorithms

### Timer Algorithm

```
startTimer():
  if isRunning: return
  timerId = setInterval(() => {
    timeRemaining -= 1
    updateDisplay()
    
    if timeRemaining <= 0:
      clearInterval(timerId)
      isRunning = false
      playCompletionSound()
      showCompletionIndicator()
  }, 1000)
  isRunning = true

stopTimer():
  if !isRunning: return
  clearInterval(timerId)
  isRunning = false

resetTimer():
  clearInterval(timerId)
  isRunning = false
  timeRemaining = duration
  updateDisplay()

setDuration(minutes):
  duration = minutes * 60
  if !isRunning:
    timeRemaining = duration
  updateDisplay()
```

### Duplicate Prevention Algorithm

```
checkDuplicate(taskText):
  normalizedText = trim(taskText).toLowerCase()
  
  for each task in tasks:
    if trim(task.text).toLowerCase() == normalizedText:
      return true
  
  return false

addTask(taskText):
  if checkDuplicate(taskText):
    throw Error("Task already exists")
  
  newTask = {
    id: generateUUID(),
    text: trim(taskText),
    completed: false,
    createdAt: Date.now()
  }
  
  tasks.push(newTask)
  saveTasks()
  renderTasks()
```

### Greeting Algorithm

```
getGreeting():
  hour = getCurrentHour()
  
  if hour >= 5 and hour < 12:
    return "Good morning"
  else if hour >= 12 and hour < 17:
    return "Good afternoon"
  else if hour >= 17 and hour < 21:
    return "Good evening"
  else:
    return "Good night"

getTimeDisplay():
  now = new Date()
  hours = padZero(now.getHours())
  minutes = padZero(now.getMinutes())
  return hours + ":" + minutes

getDateDisplay():
  now = new Date()
  days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  
  dayName = days[now.getDay()]
  month = months[now.getMonth()]
  day = now.getDate()
  year = now.getFullYear()
  
  return dayName + ", " + month + " " + day + ", " + year
```

## File Organization

### index.html

Main HTML file containing:
- Document structure with semantic elements
- Header section with greeting, timer, and mode toggle
- Main content area with To-Do List and Quick Links panels
- Required meta tags and viewport configuration
- Links to CSS and JavaScript files

### styles/style.css

Main stylesheet containing:
- CSS resets and base styles
- Theme variables (light/dark)
- Component styles for each panel
- Responsive layout with Flexbox/Grid
- Animation styles for interactions
- Hover and focus states

### scripts/app.js

Application entry point:
- Module initialization
- Event listener setup
- Initial data loading
- UI rendering triggers

### scripts/greeting.js

Greeting and time display:
- Personalized greeting logic
- Time formatting and updates
- Date formatting
- Name management

### scripts/timer.js

Timer management:
- Countdown logic
- Start/Stop/Reset functionality
- Duration configuration
- Completion handling

### scripts/todo.js

To-Do list operations:
- Task CRUD operations
- Duplicate prevention
- Local Storage integration
- Render task list

### scripts/quicklinks.js

Quick links management:
- Link CRUD operations
- URL validation
- Local Storage integration
- Render link list

### scripts/theme.js

Theme management:
- Light/Dark mode switching
- Local Storage persistence
- CSS variable updates

### scripts/storage.js

Storage utility:
- Centralized Local Storage access
- Error handling
- Fallback defaults
- Data serialization

## Testing Strategy

### Unit Tests

**Greeting Module**:
- Time display formatting
- Date display formatting
- Greeting selection for different hours
- Name validation

**Timer Module**:
- Start, stop, reset functionality
- Duration changes
- Time formatting
- Completion detection

**To-Do List Module**:
- Task addition and duplicate detection
- Task completion toggle
- Task editing
- Task deletion
- Local Storage persistence

**Quick Links Module**:
- Link addition and validation
- Link deletion
- Local Storage persistence

**Theme Module**:
- Theme switching
- Theme persistence
- CSS variable updates

### Integration Tests

- Complete user workflow (add task, start timer, toggle theme)
- Data persistence across reloads
- Concurrent updates handling
- Error recovery (storage unavailable)

### End-to-End Tests

- Full application flow from load to interaction
- Responsive layout on different screen sizes
- Keyboard navigation
- Accessibility compliance

## Error Handling

### Local Storage Errors
- Catch `QuotaExceededError` for storage full
- Catch `SecurityError` for restricted contexts
- Log errors to console with descriptive messages
- Continue operation with in-memory state

### Data Validation Errors
- Display user-friendly error messages
- Prevent invalid data from being saved
- Highlight erroneous fields

### Timer Errors
- Handle interval cleanup on page unload
- Handle duration changes during countdown

## Performance Considerations

- Debounce time display updates (once per minute)
- Use CSS transforms for animations (GPU acceleration)
- Minimize DOM manipulation with batch updates
- Lazy load optional audio assets

## Accessibility

- High contrast mode support
- Keyboard navigation for all controls
- ARIA labels for interactive elements
- Focus management for modals

## Future Enhancements

- Audio cue customization
- Task categories/tags
- Statistics and analytics
- Task due dates and reminders
- Sync across devices (backup to server)