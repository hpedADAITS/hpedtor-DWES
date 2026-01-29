FROM drupal:11-apache

# Instalar dependencias y APCu
RUN apt-get update \
    && apt-get install -y unzip \
    && pecl install apcu \
    && docker-php-ext-enable apcu \
    && rm -rf /var/lib/apt/lists/*

# Configuración recomendada para APCu en Drupal
RUN echo "apc.enable_cli=1" > /usr/local/etc/php/conf.d/apcu-drupal.ini

# Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Aumentar el memory limit
RUN echo "memory_limit = 512M" > /usr/local/etc/php/conf.d/memory-limit.ini

# Instalar imagick
RUN apt-get update && apt-get install -y \
    libmagickwand-dev \
    libheif-dev

RUN pecl install imagick
RUN docker-php-ext-enable imagick
RUN apt-get install -y imagemagick

# Instalar PECL
RUN pecl install uploadprogress \
    && docker-php-ext-enable uploadprogress
RUN echo "extension=uploadprogress.so" > /usr/local/etc/php/conf.d/uploadprogress.ini

# Instalar composer
RUN curl -sS https://getcomposer.org/installer | php
    