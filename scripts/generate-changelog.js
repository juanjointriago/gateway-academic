const fs = require('fs');
const { execSync } = require('child_process');

/**
 * Genera un changelog automático basado en commits desde el último tag
 */
function generateChangelog() {
  try {
    // Obtener el último tag
    let lastTag;
    try {
      lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim();
    } catch (error) {
      // Si no hay tags, usar el primer commit
      lastTag = execSync('git rev-list --max-parents=0 HEAD', { encoding: 'utf-8' }).trim();
    }

    // Obtener commits desde el último tag
    const commits = execSync(`git log ${lastTag}..HEAD --oneline --no-merges`, { encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(line => line.length > 0);

    if (commits.length === 0) {
      console.log('No hay cambios desde el último release');
      return;
    }

    // Categorizar commits
    const features = [];
    const fixes = [];
    const improvements = [];
    const others = [];

    commits.forEach(commit => {
      const message = commit.substring(8); // Remover el hash
      
      if (message.toLowerCase().includes('feat:') || message.toLowerCase().includes('feature:')) {
        features.push(message.replace(/^feat:\s*|^feature:\s*/i, ''));
      } else if (message.toLowerCase().includes('fix:') || message.toLowerCase().includes('bug:')) {
        fixes.push(message.replace(/^fix:\s*|^bug:\s*/i, ''));
      } else if (message.toLowerCase().includes('improve:') || message.toLowerCase().includes('refactor:')) {
        improvements.push(message.replace(/^improve:\s*|^refactor:\s*/i, ''));
      } else {
        others.push(message);
      }
    });

    // Generar changelog
    let changelog = `# Changelog\n\n`;
    changelog += `## ${new Date().toISOString().split('T')[0]}\n\n`;

    if (features.length > 0) {
      changelog += `### 🚀 Nuevas características\n`;
      features.forEach(feature => {
        changelog += `- ${feature}\n`;
      });
      changelog += '\n';
    }

    if (improvements.length > 0) {
      changelog += `### ⚡ Mejoras\n`;
      improvements.forEach(improvement => {
        changelog += `- ${improvement}\n`;
      });
      changelog += '\n';
    }

    if (fixes.length > 0) {
      changelog += `### 🐛 Correcciones\n`;
      fixes.forEach(fix => {
        changelog += `- ${fix}\n`;
      });
      changelog += '\n';
    }

    if (others.length > 0) {
      changelog += `### 📝 Otros cambios\n`;
      others.forEach(other => {
        changelog += `- ${other}\n`;
      });
      changelog += '\n';
    }

    // Escribir changelog
    fs.writeFileSync('CHANGELOG.md', changelog);
    console.log('✅ Changelog generado exitosamente');
    console.log(changelog);

  } catch (error) {
    console.error('❌ Error generando changelog:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  generateChangelog();
}

module.exports = { generateChangelog };
