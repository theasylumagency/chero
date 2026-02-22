const withNextIntl = require("next-intl/plugin")("./src/i18n/request.ts");

module.exports = withNextIntl({
    images: {
        formats: ["image/avif", "image/webp"]
    }
});