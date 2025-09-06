# TinyMCE 7.0 Integration Documentation

## Overview

The SimplifyDocs application now includes TinyMCE 7.0 rich text editing capabilities for English and Spanish content. This provides a modern, feature-rich editing experience for document content management.

## Features

### Core Editing Features
- **Rich Text Formatting**: Bold, italic, underline, strikethrough
- **Typography**: Multiple font families, sizes, and text alignment
- **Lists**: Numbered and bulleted lists with proper indentation
- **Links & Media**: Link insertion, image embedding, and media management
- **Tables**: Full table creation and editing capabilities
- **Code**: Inline code and code blocks
- **Emoticons**: Unicode emoji support

### Advanced Features
- **Quick Toolbars**: Context-sensitive toolbars for faster editing
- **Auto-resize**: Dynamic height adjustment based on content
- **Paste Handling**: Smart paste from Word and other sources
- **Preview Mode**: Side-by-side preview of formatted content
- **Keyboard Shortcuts**: Ctrl/Cmd+S for quick saving

### Language Support
- **Dual Language Editing**: Side-by-side English and Spanish editors
- **Status Tracking**: Visual status indicators for each language
- **Synchronized Operations**: Save both languages simultaneously

## Usage

### Opening the Editor
Click on any English or Spanish content cell in the grid to open the TinyMCE editor. A special pencil icon indicates rich text editing capability.

### Editor Interface
- **Left Panel**: English content editor
- **Right Panel**: Spanish content editor
- **Top Bar**: Preview toggle and unsaved changes indicator
- **Bottom Bar**: Cancel and Save buttons

### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Save changes
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y`: Redo
- `Ctrl/Cmd + B`: Bold
- `Ctrl/Cmd + I`: Italic
- `Ctrl/Cmd + U`: Underline

### Preview Mode
Toggle between edit and preview modes to see how content will be rendered. This is especially useful for:
- Checking formatting consistency
- Reviewing table layouts
- Validating link destinations
- Ensuring proper spacing and typography

## Configuration

### Editor Settings
The TinyMCE configuration includes:
- GPL license for open source usage
- Custom content styles matching application theme
- Optimized plugin selection for document editing
- Smart paste handling for Word documents
- Responsive design for various screen sizes

### Styling Integration
- Uses Inter font family to match application design
- Custom CSS for seamless UI integration
- Focus states with blue accent colors
- Rounded corners and modern shadows
- Consistent spacing and typography scale

## Best Practices

### Content Structure
- Use headings (H1-H6) for proper document hierarchy
- Apply consistent formatting throughout documents
- Use lists for better content organization
- Include alt text for images for accessibility

### Multilingual Content
- Maintain parallel structure between English and Spanish
- Ensure formatting consistency across languages
- Use appropriate language-specific typography
- Consider cultural differences in content presentation

### Performance
- Save frequently using Ctrl/Cmd+S
- Preview content before final save
- Use paste from Word feature for external content
- Avoid very large documents (>10MB) for optimal performance

## Troubleshooting

### Common Issues
1. **Editor not loading**: Check browser compatibility (Chrome, Firefox, Safari, Edge)
2. **Paste not working**: Use Ctrl/Cmd+V or the paste button in toolbar
3. **Images not displaying**: Ensure proper image URLs and permissions
4. **Slow performance**: Reduce content size or clear browser cache

### Browser Support
- Chrome 88+
- Firefox 86+
- Safari 14+
- Edge 88+

### Accessibility
- Full keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- WCAG 2.1 AA compliance

## Technical Details

### Dependencies
- `@tinymce/tinymce-react`: ^6.3.0
- TinyMCE core libraries (auto-loaded)
- Custom CSS for UI integration

### Integration Points
- `TinyMCEEditor.tsx`: Main editor component
- `RuleGrid.tsx`: Grid integration for cell editing
- `tinymce-custom.css`: Styling customizations

### Data Flow
1. User clicks on English/Spanish cell
2. Current content loaded into editors
3. Real-time change tracking
4. Async save with error handling
5. Grid updates with new content