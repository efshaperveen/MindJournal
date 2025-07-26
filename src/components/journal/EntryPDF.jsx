import { format } from 'date-fns';
import MoodIcon from './MoodIcon';
import { psychologyQuotes } from '../../data/Quotes';

const EntryPDF = ({ entry }) => {
  if (!entry) return null;

  const formattedDate = format(new Date(entry.createdAt), 'EEEE, MMMM d, yyyy');
  const randomQuote = psychologyQuotes[Math.floor(Math.random() * psychologyQuotes.length)];

  // Inline styles for a more elegant PDF design
  const styles = {
    page: {
      fontFamily: "'Lora', serif",
      backgroundColor: '#FDFDFD',
      color: '#333333',
      width: '210mm',
      minHeight: '297mm',
      padding: '40px',
      boxSizing: 'border-box',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottom: '1px solid #EAEAEA',
      paddingBottom: '15px',
      marginBottom: '30px',
    },
    journalTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2C5282', // A deep blue
    },
    date: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '14px',
      color: '#718096', // A muted gray
      textAlign: 'right',
    },
    moodSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '30px',
      backgroundColor: 'rgba(237, 242, 247, 0.5)', // A very light gray-blue
      padding: '15px',
      borderRadius: '8px',
    },
    moodIcon: {
      fontSize: '48px',
    },
    moodText: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '28px',
      fontWeight: '600',
      textTransform: 'capitalize',
      color: '#4A5568',
    },
    entryTitle: {
      fontFamily: "'Lora', serif",
      fontSize: '36px',
      fontWeight: 'bold',
      marginBottom: '25px',
      lineHeight: '1.3',
    },
    content: {
      fontSize: '16px',
      lineHeight: '1.8',
      whiteSpace: 'pre-wrap',
      flexGrow: 1,
    },
    attachments: {
      marginTop: '30px',
    },
    attachmentsTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '15px',
      borderBottom: '1px solid #EAEAEA',
      paddingBottom: '5px',
    },
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '15px',
    },
    image: {
      borderRadius: '8px',
      objectFit: 'cover',
      width: '100%',
      height: 'auto',
    },
    footer: {
      fontFamily: "'Montserrat', sans-serif",
      textAlign: 'center',
      borderTop: '1px solid #EAEAEA',
      paddingTop: '20px',
      marginTop: '40px',
      color: '#A0AEC0', // Lighter gray for footer
      fontSize: '12px',
    },
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
      
      <div id="pdf-content" style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.journalTitle}>MindJournal</h1>
          <p style={styles.date}>{formattedDate}</p>
        </div>

        <div style={styles.moodSection}>
          <div style={styles.moodIcon}>
            <MoodIcon mood={entry.mood} />
          </div>
          <h2 style={styles.moodText}>{entry.mood}</h2>
        </div>

        <h3 style={styles.entryTitle}>{entry.title}</h3>

        <div style={styles.content}>
          {entry.content}
        </div>

        {entry.images && entry.images.length > 0 && (
          <div style={styles.attachments}>
            <h4 style={styles.attachmentsTitle}>Attachments</h4>
            <div style={styles.imageGrid}>
              {entry.images.map((image, index) => (
                <img key={index} src={image} alt={`Attachment ${index + 1}`} style={styles.image} />
              ))}
            </div>
          </div>
        )}

        <div style={styles.footer}>
          <p>"{randomQuote}"</p>
        </div>
      </div>
    </>
  );
};

export default EntryPDF;
