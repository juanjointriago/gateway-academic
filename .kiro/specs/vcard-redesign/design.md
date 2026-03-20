# Design Document

## Overview

The VCard redesign will transform the existing simple card layout into a professional business card design featuring curved decorative elements, proper institutional branding, and improved visual hierarchy. The design maintains the existing flip animation while implementing a modern, branded appearance that reflects the Gateway Corporation identity.

## Architecture

### Component Structure
```
VCardScreen
├── LayoutGeneral (existing wrapper)
├── CardContainer (flip animation wrapper)
│   ├── FrontCard
│   │   ├── CurvedBackground (decorative elements)
│   │   ├── ProfileSection (image + name + role)
│   │   ├── BrandingSection (logo + company info)
│   │   └── ContactSection (ID + website)
│   └── BackCard
│       ├── CurvedBackground (decorative elements)
│       ├── SignatureSection (stylized name)
│       ├── DirectorSection (name + title)
│       └── ContactSection (phone + email + address + website)
```

### Design System

#### Color Palette
- Primary Blue: `#1B365D` (main branding color)
- Secondary Orange: `#FF7F3F` (accent color for curves)
- Tertiary Gray: `#A8A8A8` (neutral curve color)
- Background White: `#FFFFFF` (card background)
- Text Dark: `#1B365D` (primary text)
- Text Light: `#666666` (secondary text)

#### Typography Hierarchy
- Student Name: 24px, Bold, Primary Blue
- Director Name: 22px, Bold, Primary Blue  
- Role/Position: 16px, Regular, Secondary Text
- Contact Info: 14px, Regular, Secondary Text
- Website: 14px, Medium, Primary Blue
- ID: 12px, Regular, Secondary Text

## Components and Interfaces

### CurvedBackground Component
```typescript
interface CurvedBackgroundProps {
  variant: 'front' | 'back';
}
```
- Renders SVG curved elements for top and bottom decorations
- Uses different color combinations based on variant
- Positioned absolutely to create layered effect

### ProfileSection Component
```typescript
interface ProfileSectionProps {
  imageUri?: string;
  name: string;
  role: string;
}
```
- Circular profile image with blue border
- Name display with proper typography
- Role indicator ("Estudiante")

### BrandingSection Component
```typescript
interface BrandingSectionProps {
  logoUri?: string;
  companyName: string;
}
```
- Gateway Corporation logo display
- Company name with proper branding

### ContactSection Component
```typescript
interface ContactSectionProps {
  type: 'front' | 'back';
  data: ContactData;
}
```
- Conditional rendering based on card side
- Front: ID + website
- Back: phone + email + address + website button

### SignatureSection Component
```typescript
interface SignatureSectionProps {
  name: string;
}
```
- Stylized signature display in blue rounded rectangle
- Cursive/script font styling

## Data Models

### StudentCardData
```typescript
interface StudentCardData {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  studentId: string;
}
```

### InstitutionalData
```typescript
interface InstitutionalData {
  directorName: string;
  directorTitle: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  logoUrl?: string;
}
```

## Error Handling

### Missing User Data
- Display fallback message when user data is unavailable
- Provide default placeholder image when profile photo is missing
- Handle empty or null values gracefully

### Animation Errors
- Prevent multiple simultaneous flip animations
- Reset animation state if interrupted
- Maintain card visibility during animation failures

### Image Loading Errors
- Fallback to default images for profile and logo
- Handle network errors for remote images
- Provide loading states for image components

## Testing Strategy

### Unit Tests
- Component rendering with various data states
- Animation state management
- Error handling scenarios
- Props validation and defaults

### Integration Tests
- User data retrieval from auth store
- Card flip animation flow
- Touch interaction handling
- Layout responsiveness

### Visual Tests
- Design consistency across different screen sizes
- Color accuracy and branding compliance
- Typography hierarchy and spacing
- Animation smoothness and timing

### Accessibility Tests
- Screen reader compatibility
- Touch target sizes
- Color contrast ratios
- Focus management during animations

## Implementation Notes

### SVG Curved Elements
- Use react-native-svg for curved decorative elements
- Create reusable curve components with configurable colors
- Ensure proper positioning and layering

### Animation Enhancements
- Maintain existing flip animation logic
- Add subtle entrance animations for card elements
- Consider adding micro-interactions for better UX

### Responsive Design
- Ensure card scales appropriately on different screen sizes
- Maintain aspect ratio and proportions
- Test on various device orientations

### Performance Considerations
- Optimize SVG rendering for smooth animations
- Use appropriate image sizes and formats
- Implement proper component memoization where needed